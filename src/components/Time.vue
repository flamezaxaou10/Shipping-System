<template>
  <div class="Main justify-content-center row">
    <div class="col-4 my-3">
      <h3>เวลาการขนส่ง</h3>
    </div>
    <div class="col-5 my-3">
      <!-- <router-link to="/Billing">
        <vs-button color="primary" type="filled" icon="add_circle">เปิดบิล</vs-button>
      </router-link>-->
      <b-form-input id="search" v-model="search" type="text" required placeholder="ค้นหาเลขที่บิล"></b-form-input>
    </div>

    <div class="col-10 table-responsive" v-if="billing">
      <table class="table border table-hover table-bordered">
        <thead class="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">รายการ</th>
            <th scope="col">เลขที่บิล</th>
            <th scope="col">รหัสลูกค้า</th>
            <th scope="col">ลูกค้า</th>
            <th scope="col">วันที่สั่งสินค้า</th>
            <th scope="col">ร้านส่งออก</th>
            <th scope="col">เซ็นรับ</th>
            <th scope="col">เข้าระบบ</th>
            <th scope="col">ส่งออกจีน</th>
            <th scope="col">เข้าโกดังไทย</th>
            <th scope="col">ส่งไปบ้าน</th>
            <th scope="col">รับสินค้า</th>
            <th scope="col">ค่าขนส่ง</th>
            <th scope="col">Tracking Number</th>
          </tr>
        </thead>
        <tbody v-if="billing">
          <tr v-for="(val, index) in billing" :key="val.id">
            <th scope="row">
              <router-link :to="'/TimeShipping/' + val.id ">{{index + 1}}</router-link>
            </th>
            <td>
              <div
                class="border-bottom"
                v-for="(product,index) in val.billing"
                :key="index"
              >{{product.product.name}}</div>
            </td>
            <td>
              <span v-if="val.timeShipping">{{val.timeShipping.tracking}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="val.timeShipping">{{val.timeShipping.idCustomer}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <customer-name :idCustomer="val.customer" name="true"></customer-name>
            </td>
            <td>
              <p>{{val.timestamp | moment("DD-MM-YY" )}}</p>
              <b-badge variant="success">{{"วันที่สั่งสินค้า"}}</b-badge>
            </td>
            <td>
              <span v-if="val.timeShipping">
                <span v-if="val.timeShipping.exportStore">
                  {{val.timeShipping.exportStore | moment("DD-MM-YY")}}
                  <p>
                    <b-badge variant="success">{{"วันที่ได้จริง"}}</b-badge>
                  </p>
                </span>
                <span v-else>
                  -
                  <p>
                    <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
                  </p>
                </span>
              </span>
              <p v-else>
                <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
              </p>
              {{val.timestamp | moment("add",val.billing[0].product.export + " days","DD-MM-YY")}}
              <p>
                <b-badge variant="warning">{{"วันที่คาดการณ์"}}</b-badge>
              </p>
            </td>
            <td>
              <span v-if="val.timeShipping">
                <span v-if="val.timeShipping.signature">
                  {{val.timeShipping.signature | moment("DD-MM-YY")}}
                  <p>
                    <b-badge variant="success">{{"วันที่ได้จริง"}}</b-badge>
                  </p>
                </span>
                <span v-else>
                  -
                  <p>
                    <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
                  </p>
                </span>
              </span>
              <p v-else>
                <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
              </p>
              {{val.timestamp | moment("add",parseInt(val.billing[0].product.sign) + parseInt(val.billing[0].product.export) + " days","DD-MM-YY")}}
              <p>
                <b-badge variant="warning">{{"วันที่คาดการณ์"}}</b-badge>
              </p>
            </td>
            <td>
              <p v-if="val.timeShipping">
                <span v-if="val.timeShipping.signin">
                  {{val.timeShipping.signin | moment("DD-MM-YY")}}
                  <p>
                    <b-badge variant="success">{{"วันที่ได้จริง"}}</b-badge>
                  </p>
                </span>
                <span v-else>
                  -
                  <p>
                    <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
                  </p>
                </span>
              </p>
              <p v-else>
                <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
              </p>
            </td>
            <td>
              <p v-if="val.timeShipping">
                <span v-if="val.timeShipping.exportCN">
                  {{val.timeShipping.exportCN | moment("DD-MM-YY")}}
                  <p>
                    <b-badge variant="success">{{"วันที่ได้จริง"}}</b-badge>
                  </p>
                </span>
                <span v-else>
                  -
                  <p>
                    <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
                  </p>
                </span>
              </p>
              <p v-else>
                <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
              </p>
            </td>
            <td>
              <span v-if="val.timeShipping">
                <span v-if="val.timeShipping.toTH">
                  {{val.timeShipping.toTH | moment("DD-MM-YY")}}
                  <p>
                    <b-badge variant="success">{{"วันที่ได้จริง"}}</b-badge>
                  </p>
                </span>
                <span v-else>
                  -
                  <p>
                    <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
                  </p>
                </span>
              </span>
              <p v-else>
                <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
              </p>
              <span v-if="val.timeShipping">
                {{val.timeShipping.exportCN | moment("add",parseInt(val.billing[0].product.import) + " days","DD-MM-YY")}}
                <p v-if="val.timeShipping.exportCN">
                  <b-badge variant="warning">{{"วันที่คาดการณ์"}}</b-badge>
                </p>
              </span>
            </td>
            <td>
              <span v-if="val.timeShipping">
                <span v-if="val.timeShipping.toCustomer">
                  {{val.timeShipping.toCustomer | moment("DD-MM-YY")}}
                  <p>
                    <b-badge variant="success">{{"วันที่ได้จริง"}}</b-badge>
                  </p>
                </span>
                <span v-else>
                  -
                  <p>
                    <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
                  </p>
                </span>
              </span>
              <p v-else>
                <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
              </p>
              <span v-if="val.timeShipping">
                {{val.timeShipping.toTH | moment("add",parseInt(1) + " days","DD-MM-YY")}}
                <p v-if="val.timeShipping.toTH">
                  <b-badge variant="warning">{{"วันที่คาดการณ์"}}</b-badge>
                </p>
              </span>
            </td>
            <td>
              <p v-if="val.timeShipping">
                <span v-if="val.timeShipping.success">
                  {{val.timeShipping.success | moment("DD-MM-YY")}}
                  <p>
                    <b-badge variant="success">{{"วันที่ได้จริง"}}</b-badge>
                  </p>
                </span>
                <span v-else>
                  -
                  <p>
                    <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
                  </p>
                </span>
              </p>
              <p v-else>
                <b-badge variant="secondary">{{"รอดำเนินการ"}}</b-badge>
              </p>
            </td>
            <td>
              <p v-if="val.timeShipping">
                <b-badge
                  variant="success"
                  v-if="val.timeShipping.statusPrice"
                >{{val.timeShipping.statusPrice}}</b-badge>
                <b-badge variant="info" v-else>{{"รอการชำระค่าขนส่ง"}}</b-badge>
              </p>
              <p v-else>
                <b-badge variant="info">{{"รอการชำระค่าขนส่ง"}}</b-badge>
              </p>
            </td>
            <td>
              <span v-if="val.timeShipping">{{val.timeShipping.trackingTH}}</span>
              <span v-else>-</span>

            </td>
          </tr>
        </tbody>
      </table>
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
export default {
  name: "Billing",
  data() {
    return {
      billing: [],
      customer: [],
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
            "SELECT * FROM Billings WHERE `timeShipping.tracking` LIKE '" + this.search + "%'",
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
  methods: {},
  mounted() {
    this.isLogin = this.$session.get("isLogin");
    if (this.isLogin) {
      fireSQL
        .rxQuery("SELECT * FROM Billings ORDER BY timestamp DESC", {
          includeId: "id"
        })
        .subscribe(documents => {
          this.$vs.loading.close();
          this.billing = documents;
          console.log(this.billing);
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
    this.$vs.loading({
      type: "sound"
    });
  }
};
</script>

<style lang="scss" scoped>
</style>