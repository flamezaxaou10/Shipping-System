<template>
  <div class="Main justify-content-center row">
    <div class="col-7 text-left my-3">
      <h3>รายงานสรุปแต่ละรายการ</h3>
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
            <th scope="col">ค่าขนส่งในจีน (CNY)</th>
            <th scope="col">รวมราคา (CNY)</th>
            <th scope="col">เรทเงินต้นทุน (THB)</th>
            <th scope="col">รวมราคา (THB)</th>
             <th scope="col">ค่าขนส่ง (THB)</th>
            <th scope="col">ส่วนต่าง (THB)</th>
            <th scope="col">ส่วนต่างค่าขนส่ง (THB)</th>
            <th scope="col">สถานะ</th>
            <th scope="col">สถานะการชำระเงิน</th>
            <th scope="col">จัดการบิล</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(val, index) in billing" :key="val.id">
            <th scope="row">{{index + 1}}</th>
            <td>{{val.timestamp | moment("DD/MM/Y")}}</td>
            <td>
              <customer-name :idCustomer="val.customer" name="true"></customer-name>
            </td>
            <td>
              <div
                class="border-bottom"
                v-for="(product,index) in val.billing"
                :key="index"
              >{{product.product.name}}</div>
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
              >{{new Intl.NumberFormat({ style: 'currency'}).format(product.product.cost)}}</div>
            </td>
            <td>{{new Intl.NumberFormat({ style: 'currency'}).format(val.shipping)}}</td>
            <td>
              <div
                class="border-bottom"
                v-for="(product,index) in val.billing"
                :key="index"
              >{{new Intl.NumberFormat({ style: 'currency'}).format( product.product.cost * product.count)}}</div>
              <b
                class="text-primary"
              >{{new Intl.NumberFormat({ style: 'currency'}).format(parseFloat(val.shipping) + val.total.cost) }}</b>
            </td>
            <td>
              <b
                v-if="editRateCost !== index"
                class="text-primary"
              >{{new Intl.NumberFormat({ style: 'currency'}).format(val.rateTHBcost)}}</b>
              
              <b-form-input
                v-else
                v-model="valueEdit"
                type="number"
                step="0.01"
                required
                placeholder="เรทเงิน"
              ></b-form-input>
            </td>
            <td>
              <b
                class="text-success"
              >{{new Intl.NumberFormat({ style: 'currency'}).format((parseFloat(val.shipping) + parseFloat(val.total.cost)) * val.rateTHBcost )}}</b>
            </td>
            <td>
              <a
                v-if="shippings[index]"
              >ต้นทุน : {{new Intl.NumberFormat({ style: 'currency'}).format(shippings[index].totalAllShipCost)}}</a>
              <a
                v-if="shippings[index]"
              >ลูกค้า : {{new Intl.NumberFormat({ style: 'currency'}).format(shippings[index].totalAllShip)}}</a>
            </td>
 
            <td>
              <a
                class="text-info"
              >{{new Intl.NumberFormat({ style: 'currency'}).format(((parseFloat(val.total.price) + parseFloat(val.shipping)) * parseFloat(val.rateTHBprice))-(parseFloat(val.total.cost) + parseFloat(val.shipping)) * parseFloat(val.rateTHBcost))}}</a><br>
              <a>ขาย : {{new Intl.NumberFormat({ style: 'currency'}).format((parseFloat(val.total.price) + parseFloat(val.shipping)) * parseFloat(val.rateTHBprice))}}</a>
              <a>ทุน : {{new Intl.NumberFormat({ style: 'currency'}).format((parseFloat(val.total.cost) + parseFloat(val.shipping)) * parseFloat(val.rateTHBcost))}}</a>
          
        


            </td>

            <td>
              <b
                v-if="shippings[index]"
                class="text-info"
              >{{new Intl.NumberFormat({ style: 'currency'}).format(shippings[index].totalAllShip - shippings[index].totalAllShipCost)}}</b>
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
              <b-badge class="btn btn-warning" variant="warning" v-else>{{val.status_money}}</b-badge>
            </td>
            <td>
              <vs-button
                v-if="editRateCost !== index"
                color="primary"
                type="filled"
                icon="edit"
                @click="editShow(index)"
              ></vs-button>
              <div v-else>
                <vs-button color="danger" type="filled" icon="cancel" @click="editHide(index)"></vs-button>
                <vs-button color="primary" type="filled" icon="check" @click="editUpdate(index)"></vs-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { FireSQL } from "firesql";
import "firesql/rx";
const fireSQL = new FireSQL(firebase.firestore());
import CustomerName from "../getdatabase/CustomerName.vue";
var billingFirestore = firebase.firestore().collection("Billings");
var shippingFirestore = firebase.firestore().collection("Shippings");
import momentjs from "moment";
export default {
  name: "Billing",
  data() {
    return {
      TotalPrice: 0,
      customerFullname: "",
      billing: [],
      customer: [],
      billingReport: [],
      customerIndex: [],
      output: null,
      profit: {},
      total: {},
      shippings: [],
      profitShipping: 0,
      totalcost: {},
      reportShipping: {},
      reportShippingCost: {},
      reportShippingProfit: {},
      editRateCost: null,
      valueEdit: 0
    };
  },
  components: {
    CustomerName
  },
  methods: {
    billingDetail(index, val, customer) {
      this.billingReport = [];
      this.customerIndex = [];
      //val.customer current ID customer
      for (var cust in customer) {
        if (val.customer == customer[cust].id) {
          this.customerFullname = customer[cust].nickname;
          this.customerIndex.push({
            nickname: customer[cust].nickname,
            fullname: customer[cust].fullname,
            tel: customer[cust].tel,
            address: customer[cust].address
          });
        }
      }
      console.log(this.customerIndex);

      this.billingReport.push({
        index: index,
        time: val.timestamp,
        name: val.customer,
        product: val.billing,
        customer: customer
      });
      this.TotalPrice =
        val.total.price * val.rateTHBprice - val.total.cost * val.rateTHBcost;

      this.customerFullname = customer.fullname;
    },
    print() {
      // Pass the element id here
      this.$htmlToPaper("printMe", () => {
        console.log("Printing done or got cancelled!");
      });
    },
    editShow(index) {
      console.log("show edit input");
      this.editRateCost = index;
      this.valueEdit = this.billing[index].rateTHBcost;
    },
    editHide(index) {
      this.editRateCost = null;
      this.valueEdit = 0;
    },
    editUpdate(index) {
      this.$swal({
        title: "ต้องการเรทเงิน ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "อัพเดตข้อมูล!"
      }).then(result => {
        billingFirestore.doc(this.billing[index].id).update({
          rateTHBcost: this.valueEdit
        });
        this.$swal({
          title: "สำเร็จ",
          text: "อัพเดตข้อมูลสำเร็จ",
          type: "success",
          timer: 2000
        });
        this.editRateCost = null;
      });
    }
  },
  async mounted() {
    this.isLogin = this.$session.get("isLogin");
    if (this.isLogin) {
      fireSQL
        .rxQuery("SELECT * FROM Billings ORDER BY timestamp DESC", {
          includeId: "id"
        })
        .subscribe(documents => {
          this.$vs.loading.close();
          this.billing = documents;
        });

      fireSQL
        .rxQuery("SELECT * FROM Shippings ORDER BY timestamp DESC")
        .subscribe(documents => {
          this.$vs.loading.close();
          this.shippings = documents;
          console.log(this.shippings);
        });
    } else {
      this.$router.push("/");
    }
    this.$vs.loading({
      type: "sound"
    });
  }
};
</script>

<style lang="scss" scoped>
</style>