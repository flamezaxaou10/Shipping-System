<template>
  <div class="Main justify-content-center row">
    <div class="col-1 text-left my-3"></div>
    <div class="col-1 text-left my-3">
      <h3>บิลลูกค้า  </h3>
    </div>
    <div class="col-3 my-3">
      <b-form-input id="search" v-model="search" type="text" required placeholder="ค้นหาลูกค้า"></b-form-input>
    </div>
    <div class="col-5 text-left my-3"></div>
    <div class="col-2 justify-content my-3">
      <router-link to="/Billing">
        <vs-button color="primary" type="filled" icon="add_circle">เปิดบิล</vs-button>
      </router-link>
    </div>
    
    <div class="col-12 col-lg-10 table-responsive">
      <table class="table border table-hover table-bordered">
        <thead class="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">วันที่</th>
            <th scope="col">ลูกค้า</th>
            <th scope="col">รายการสินค้า</th>
            <th scope="col">คุณสมบัติ</th>
            <th scope="col">จำนวน</th>
            <th scope="col">ราคา(CNY)</th>
            <th scope="col">ค่าขนส่งในจีน(CNY)</th>
            <th scope="col">รวมราคา(CNY)</th>
            <th scope="col">ค่าเงิน(THB)</th>
            <th scope="col">รวมราคา (THB)</th>
            <th scope="col">สถานะ</th>
            <th scope="col">สถานะการชำระเงิน</th>
            <th scope="col" width="10%">จัดการบิล</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(val, index) in billing" :key="val.id">
            <th scope="row">{{index + 1}}</th>
            <td>{{val.timestamp | moment("DD/MM/Y")}}</td>
            <td>
              <customer-name :idCustomer="val.customer" name="true" v-model="customer"></customer-name>
            </td>

            <td>
              <div
                class="border-bottom"
                v-for="(product,index) in val.billing"
                :key="index"
              >{{product.product.name}}</div>

              <!-- <div v-if="product.product.name == product.product.name">
                รวม
              </div>-->
            </td>

            <td>
              <div
                class="border-bottom"
                v-for="(product,index)  in val.billing"
                :key="index"
              >{{product.properties}}</div>
              <b class="text-primary">{{"รวม"}}</b>
            </td>
            <td>
              <div
                class="border-bottom"
                v-for="(product,index)  in val.billing"
                :key="index"
              >{{new Intl.NumberFormat({ style: 'currency'}).format(product.count)}}</div>

              <b
                class="text-primary"
              >{{new Intl.NumberFormat({ style: 'currency'}).format(val.total.count)}}</b>
            </td>
            <td>
              <div
                class="border-bottom"
                v-for="(product,index)  in val.billing"
                :key="index"
              >{{product.product.price}}</div>
            </td>
            <td>
              <div class>{{new Intl.NumberFormat({ style: 'currency'}).format(val.shipping)}}</div>
            </td>
            <td>
              <div
                class="border-bottom"
                v-for="(product,index) in val.billing"
                :key="index"
              >{{new Intl.NumberFormat({ style: 'currency'}).format(product.product.price * product.count)}}</div>
              <b
                class="text-primary"
              >{{new Intl.NumberFormat({ style: 'currency'}).format(parseFloat(val.total.price) + parseFloat(val.shipping))}}</b>
            </td>
            <td>
              <div
                class="border-bottom"
                v-for="(product,index)  in val.billing"
                :key="index"
              >{{val.rateTHBprice}}</div>
            </td>
            <td>
              <b
                class="text-success"
              >{{new Intl.NumberFormat({ style: 'currency'}).format((parseFloat(val.total.price) + parseFloat(val.shipping)) * val.rateTHBprice)}}</b>
            </td>
            <td>
              <b-badge
                variant="success"
                v-if="val.status === 'รับสินค้าแล้ว'"
                :to="'/TimeShipping/' + val.id"
              >{{val.status}}</b-badge>
              <b-badge variant="info" :to="'/TimeShipping/' + val.id" v-else>{{val.status}}</b-badge>
            </td>
            <td>
              <b-badge variant="success" v-if="val.status_money === 'ชำระแล้ว'">{{val.status_money}}</b-badge>
              <b-badge
                class="btn btn-warning"
                variant="warning"
                @click="updateStatusMoney(val.id)"
                v-else
              >{{val.status_money}}</b-badge>
            </td>
            <td>
              <vs-button
                color="warning"
                :to="'/Shipping/' + val.id"
                type="filled"
                icon="settings"
                class="mr-2"
              ></vs-button>
              <vs-button
                v-b-modal.billingDetail
                color="primary"
                type="filled"
                icon="local_printshop"
                @click="billingDetail(index ,val,customer)"
              ></vs-button>
              <vs-button
                v-b-modal.billingShipping
                color="success"
                type="filled"
                icon="local_shipping"
                @click="billingShippingSelect(val.id,index ,val,customer)"
              ></vs-button>
              <vs-button color="danger" type="filled" icon="delete" @click="deleteBilling(val.id)"></vs-button>
            </td>
          </tr>
        </tbody>
      </table>
      <b-modal id="billingDetail" title="ข้อมูลบิลลูกค้า" size="xl" v-if="billingReport">
        <div id="printMe">
          <b-row>
            <b-col cols="12">
              <h4>Express Shipping</h4>
              <br />
            </b-col>
            <b-col cols="4">
              <label>
                <span class="float-left mr-2">ชื่อเล่น :</span>
                <customer-name class="float-left" :idCustomer="billingReport.customer" name="true"></customer-name>
              </label>
            </b-col>

            <b-col cols="4">
              <label>
                <span class="float-left mr-2">ชื่อ-นามสกุล :</span>
                <customer-name
                  class="float-left"
                  :idCustomer="billingReport.customer"
                  fullname="true"
                ></customer-name>
              </label>
            </b-col>
            <b-col cols="4"></b-col>
            <b-col cols="4">
              <label>
                <span class="float-left mr-2">เบอร์โทร :</span>
                <customer-name class="float-left" :idCustomer="billingReport.customer" tel="true"></customer-name>
              </label>
            </b-col>
            <b-col cols="4">
              <label>
                <span class="float-left mr-2">ID Line :</span>
                <customer-name class="float-left" :idCustomer="billingReport.customer" line="true"></customer-name>
              </label>
            </b-col>
            <b-col cols="4"></b-col>
            <b-col cols="12">
              <label>
                <span class="float-left mr-2">ที่อยู่ :</span>

                <customer-name
                  class="float-left"
                  :idCustomer="billingReport.customer"
                  address="true"
                ></customer-name>
              </label>
            </b-col>
            <b-col cols="12">
              <label>
                <span class="float-left mr-2">หมายเหตุ :</span>
                <!-- <customer-name
                  class="float-left"
                  :idCustomer="billingReport.customer"
                  noteBill="true"
                ></customer-name>-->
                {{billingReport.noteBill}}
              </label>
            </b-col>

            <b-col cols="12">
              <div class="col-11 text-center my-1">
                <h5>รายละเอียดสินค้า</h5>
              </div>
            </b-col>

            <b-col cols="12" class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <th>#</th>
                  <th>รายการ</th>
                  <th>คุณสมบัติ</th>
                  <th>จำนวน</th>
                  <th>ราคาต่อชิ้น(CNY)</th>
                  <th>จำนวนเงิน(CNY)</th>
                </thead>

                <tbody>
                  <tr v-for="(prod,index) in billingReport.billing" :key="index">
                    <td>{{index + 1}}</td>
                    <td>{{prod.product.name}}</td>
                    <td>{{prod.properties}}</td>
                    <td>{{prod.count}}</td>
                    <td>{{new Intl.NumberFormat({ style: 'currency'}).format(prod.product.price)}}</td>
                    <td>{{new Intl.NumberFormat({ style: 'currency'}).format(prod.count * prod.product.price)}}</td>
                  </tr>
                  <tr>
                    <td colspan="3">ยอดเงินรวม</td>
                    <td>{{billingReport.total.count}}</td>
                    <td></td>
                    <td>{{new Intl.NumberFormat({ style: 'currency'}).format(billingReport.total.price)}}</td>
                  </tr>
                </tbody>
              </table>
            </b-col>
            <b-col cols="3"></b-col>
            <b-col cols="3">
              ค่าขนส่งในจีน :
              <b>{{new Intl.NumberFormat({ style: 'currency'}).format(billingReport.shipping)}}</b> หยวน
            </b-col>
            <b-col cols="3">
              รวม :
              <b>{{new Intl.NumberFormat({ style: 'currency'}).format(parseFloat(billingReport.total.price) + parseFloat(billingReport.shipping))}}</b> หยวน
            </b-col>
            <b-col cols="3">เรทค่าเงินไทย : {{billingReport.rateTHBprice}} บาท</b-col>
            <b-col cols="12" class="text-right mt-4">
              <h4>
                ยอดเงินรวม :
                <span class="text-success">
                  <b>{{new Intl.NumberFormat({ style: 'currency'}).format((parseFloat(billingReport.total.price) + parseFloat(billingReport.shipping)) * billingReport.rateTHBprice)}}</b>
                </span> บาท
              </h4>
            </b-col>
          </b-row>
        </div>
        <div class="col-12 justify-content-end">
          <vs-button color="primary" type="filled" icon="print" @click="print()">Print</vs-button>
        </div>
      </b-modal>

      <b-modal id="billingShipping" title="ข้อมูลการขนส่ง" size="xl">
        <div id="printShipping">
          <b-row v-if="billingShipping">
            <b-col cols="12">
              <h4>Express Shipping</h4>
              <br />
            </b-col>

            <b-col cols="12 h5">เลขที่บิล : {{billingReport.timeShipping.tracking}}</b-col>
            <b-col cols="4">
              <label>
                <span class="float-left mr-2">ชื่อเล่น :</span>
                <customer-name class="float-left" :idCustomer="billingReport.customer" name="true"></customer-name>
              </label>
            </b-col>

            <b-col cols="4">
              <label>
                <span class="float-left mr-2">ชื่อ-นามสกุล :</span>
                <customer-name
                  class="float-left"
                  :idCustomer="billingReport.customer"
                  fullname="true"
                ></customer-name>
              </label>
            </b-col>
            <b-col cols="4"></b-col>
            <b-col cols="4">
              <label>
                <span class="float-left mr-2">เบอร์โทร :</span>
                <customer-name class="float-left" :idCustomer="billingReport.customer" tel="true"></customer-name>
              </label>
            </b-col>
            <b-col cols="4">
              <label>
                <span class="float-left mr-2">ID Line :</span>
                <customer-name class="float-left" :idCustomer="billingReport.customer" line="true"></customer-name>
              </label>
            </b-col>
            <b-col cols="4"></b-col>
            <b-col cols="12">
              <label>
                <span class="float-left mr-2">ที่อยู่ :</span>

                <customer-name
                  class="float-left"
                  :idCustomer="billingReport.customer"
                  address="true"
                ></customer-name>
              </label>
            </b-col>
            <b-col cols="6" v-if="billingShipping.shipping === 'CAR'">
              การขนส่งระหว่างประเทศ :
              <b>ขนส่งทางรถ</b>
            </b-col>
            <b-col cols="6" v-if="billingShipping.shipping === 'SHIP'">
              การขนส่งระหว่างประเทศ :
              <b>ขนส่งทางเรือ</b>
            </b-col>
            <b-col cols="6">
              ประเภทสินค้า :
              <b>{{shippingData[billingShipping.productType].name}}</b>
            </b-col>
            <b-col cols="6">
              การขนส่งภายในประเทศ :
              <b>{{billingShipping.shippingTH}}</b>
            </b-col>
            <b-col cols="6" v-if="billingShipping.area === 0">
              ภูมิภาค :
              <b>ภาคกลาง ตะวันออก ตะวันตก</b>
            </b-col>
            <b-col cols="6" v-if="billingShipping.area === 1">
              ภูมิภาค :
              <b>ภาคเหนือ อีสาน ใต้</b>
            </b-col>
            <b-col cols="6">
              ปริมาตร :
              <b>{{new Intl.NumberFormat({ style: 'currency'}).format(billingShipping.capacity)}}</b> ลูกบาศก์เมตร
            </b-col>
            <b-col cols="6">
              น้ำหนัก :
              <b>{{new Intl.NumberFormat({ style: 'currency'}).format(billingShipping.weight)}}</b> กิโลกรัม
            </b-col>
            <b-col cols="6">
              อัตราต่อหน่วย :
              <b>{{new Intl.NumberFormat({ style: 'currency'}).format(billingShipping.rateunit)}}</b> บาท
            </b-col>
            <b-col cols="12">
              หมายเหตุ :
              <b>{{billingShipping.noteShipping}}</b>
            </b-col>
            <!-- <b-col cols="6" class="mt-5"></b-col> -->
            <b-col cols="6">
              ค่าขนส่งระหว่างประเทศ :
              <b
                class="text-warning"
              >{{new Intl.NumberFormat({ style: 'currency'}).format(billingShipping.totalShipping)}}</b> บาท
            </b-col>
            <b-col cols="6"></b-col>
            <b-col cols="6" v-if="billingShipping.totalInTH === 0">
              ค่าขนส่งภายในประเทศ :
              <b
                class="text-warning"
              >{{new Intl.NumberFormat({ style: 'currency'}).format(billingShipping.totalInTH)}}</b> บาท (เก็บเงินปลายทาง)
            </b-col>
            <b-col cols="6" v-else>
              ค่าขนส่งภายในประเทศ :
              <b
                class="text-warning"
              >{{new Intl.NumberFormat({ style: 'currency'}).format(billingShipping.totalInTH)}}</b> บาท
            </b-col>

            <b-col cols="12">
              ค่าบริการ :
              <b
                class="text-warning"
              >{{new Intl.NumberFormat({ style: 'currency'}).format(billingShipping.charge)}}</b> บาท
            </b-col>
            <b-col cols="12 my-3 h5">
              รวมค่าขนส่ง :
              <b
                class="text-info"
              >{{new Intl.NumberFormat({ style: 'currency'}).format(parseFloat(billingShipping.totalInTH) + billingShipping.totalShipping + billingShipping.charge)}}</b> บาท
            </b-col>
            <b-col cols="6">Tracking Number : {{billingReport.timeShipping.trackingTH}}</b-col>
            <b-col cols="6"></b-col>
            <b-col cols="6">
              กำหนดเข้าไทยโดยประมาณ :
              <span v-if="billingReport.timeShipping">
                <b
                  v-if="billingReport.timeShipping.toTH"
                >{{billingReport.timeShipping.toTH | moment("DD/MM/Y")}}</b>
                <b v-else>ยังไม่สามารถคำนวณได้</b>
              </span>
              <b v-else>ยังไม่สามารถคำนวณได้</b>
            </b-col>
            <b-col cols="12">
              <table class="table table-bordered">
                <tr>
                  <th>กล่อง</th>
                  <th>น้ำหนัก</th>
                  <th>ปริมาตร</th>
                </tr>
                <tr v-for="(val, index) in billingShipping.boxes" :key="index">
                  <td>{{index + 1}}</td>
                  <td>{{val}}</td>
                  <td>{{billingShipping.value[index]}}</td>
                </tr>
              </table>
            </b-col>
          </b-row>
        </div>
        <b-row class="flaot-right">
          <vs-button color="primary" type="filled" icon="print" @click="printShipping()">Print</vs-button>
        </b-row>
      </b-modal>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { FireSQL } from "firesql";
import "firesql/rx";
const fireSQL = new FireSQL(firebase.firestore());
import CustomerName from "../getdatabase/CustomerName.vue";
var shippingFirestore = firebase.firestore().collection("Shippings");
var billingFirestore = firebase.firestore().collection("Billings");
var shippingDataFirestore = firebase.firestore().collection("ShippingData");
var shippingDataTHFirestore = firebase.firestore().collection("ShippingDataTH");

export default {
  name: "Billing",
  data() {
    return {
      TotalPrice: 0,
      customerFullname: "",
      billing: [],
      customer: [],
      billingReport: null,
      customerIndex: [],
      output: null,
      shippingData: [],
      billingShipping: null,
      search: null
    };
  },
  components: {
    CustomerName
  },
  watch: {
    search() {
      if (this.search.length > 0) {
        console.log(this.search);
        fireSQL
          .rxQuery(
            "SELECT * FROM Billings WHERE nickname LIKE '" + this.search + "%'",
            { includeId: "id" }
          )
          .subscribe(documents => {
            this.billing = documents;
          });
        console.log(this.billing);
      } else {
        fireSQL
          .rxQuery("SELECT * FROM Billings", { includeId: "id" })
          .subscribe(documents => {
            this.$vs.loading.close();
            this.billing = documents;
            console.log(this.billing);
            console.log("+++++++");
          });
      }
    }
  },
  methods: {
    billingDetail(index, val, customer) {
      this.billingReport = this.billing[index];
      console.log(this.billingReport);
      this.customerIndex = [];
      this.TotalPrice = val.total.price * val.rateTHBprice;
      this.customerFullname = customer.fullname;
    },
    updateStatusMoney(id) {
      this.$swal({
        title: "ชำระเงินแล้ว ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33"
      }).then(result => {
        if (result.value) {
          billingFirestore.doc(id).update({
            status_money: "ชำระแล้ว"
          });
          this.$swal({
            title: "สำเร็จ",
            text: "ชำระเงินสำเร็จ",
            type: "success",
            timer: 2000
          });
        }
      });
    },
    deleteBilling(id) {
      this.$swal({
        title: "ต้องการลบบิล ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33"
      }).then(result => {
        if (result.value) {
          billingFirestore.doc(id).delete();
          shippingFirestore.doc(id).delete();
          this.$swal({
            title: "สำเร็จ",
            text: "ลบบิลเรียบร้อย",
            type: "success",
            timer: 2000
          });
        }
      });
    },
    print() {
      // Pass the element id here
      this.$htmlToPaper("printMe", () => {
        console.log("Printing done or got cancelled!");
      });
    },
    printShipping() {
      // Pass the element id here
      this.$htmlToPaper("printShipping", () => {
        console.log("Printing done or got cancelled!");
      });
    },
    billingShippingSelect(id, index, val, customer) {
      this.$vs.loading({
        type: "sound"
      });
      this.billingShipping = null;
      shippingFirestore
        .doc(id)
        .get()
        .then(doc => {
          if (doc.exists) {
            this.billingShipping = doc.data();
            this.billingShipping.id = doc.id;
          }
          this.$vs.loading.close();
        });
      this.billingReport = this.billing[index];
      console.log(this.billingReport);
      this.customerIndex = [];
    }
  },
  mounted() {
    this.isLogin = this.$session.get("isLogin");
    if (this.isLogin) {
      this.$vs.loading({
        type: "sound"
      });
      shippingDataFirestore
        .orderBy("priority")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.shippingData.push(doc.data());
          });
        });
      fireSQL
        .rxQuery("SELECT * FROM Billings ORDER BY timestamp DESC", {
          includeId: "id"
        })
        .subscribe(documents => {
          this.$vs.loading.close();
          this.billing = documents;
        });
      fireSQL
        .rxQuery("SELECT * FROM Customers", { includeId: "id" })
        .subscribe(documents => {
          this.$vs.loading.close();
          this.customer = documents;
        });
    } else {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>