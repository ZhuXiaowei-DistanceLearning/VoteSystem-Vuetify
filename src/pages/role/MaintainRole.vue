<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-card>
          <v-card-title>
            <p style="margin: 30px 100px">
              投票列表
            </p>
            <v-spacer>
            </v-spacer>
            <v-text-field
              append-icon="search"
              label="搜索"
              single-line
              hide-details
              v-model="search"></v-text-field>
          </v-card-title>
          <v-divider/>
          <v-data-table
            :items="items"
            :headers="headers"
            :pagination.sync="pagination"
            :total-items="totalItems"
            :loading="loading"
            no-data-text="暂时没有用户"
            class="elevation-1">
            <template v-slot:items="props">
              <td class="text-xs-center">{{props.item.username}}</td>
              <td class="text-xs-center">{{ props.item.age }}</td>
              <td class="text-xs-center">{{ props.item.gender ==1 ?'男':'女'}}</td>
              <td class="text-xs-center">{{ props.item.birthday}}</td>
              <td class="text-xs-center">{{ props.item.region}}</td>
              <td class="text-xs-center">{{ props.item.version == 1?'管理员':'普通会员'}}</td>
              <td class="text-xs-center">
                <v-btn
                  round
                  dark
                  @click="mainVote(props.item.id)"
                  color="info"
                  style="margin-left:150px">信息维护
                </v-btn>
              </td>
            </template>
            <template slot="pageText" slot-scope="props">
              共{{props.itemsLength}}条,当前:{{ props.pageStart }} - {{ props.pageStop }}
            </template>
          </v-data-table>
          <v-dialog v-model="show" scrollable max-width="300px">
            <v-card>
              <v-container>
                <p>用户名：{{mainInfo.username}}</p>
                <input type="radio" id="one" value="2" v-model="radios">
                <label for="one">普通会员</label>
                <br>
                <input type="radio" id="two" value="1" v-model="radios">
                <label for="two">管理员</label>
                <v-btn
                  round
                  dark
                  @click="insertItem"
                  color="info"
                  style="margin-left:150px">维护
                </v-btn>
              </v-container>
            </v-card>
          </v-dialog>
          <v-dialog v-model="alertShow" width="1000">
            <v-alert color="success" icon="check_circle" type="success" :value="alertSucShow" dismissible>投票成功</v-alert>
            <v-alert color="error" icon="check_circle" type="error" :value="alertErrShow" dismissible>投票失败
            </v-alert>
          </v-dialog>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import VoteResult from './mainRole'

  export default {
    name: "Vote",
    data() {
      return {
        search: '',
        show: false,
        radios: '',
        mainInfo: '',
        isVote: false,
        optionId: '',
        voteR: false,
        alertSucShow: false,
        alertErrShow: false,
        alertShow: false,
        subjectId: '',
        btnStatus: {
          title: '',
          disable: '',
          color: ''
        },
        totalItems: 0,// 总条数
        loading: true,
        headers: [
          {
            'text': '用户名',
            align: 'center',
            sortable: false
          },
          {
            'text': '年龄',
            align: 'center',
            sortable: false
          },
          {
            'text': '性别',
            align: 'center',
            sortable: false
          },
          {
            'text': '出生日期',
            align: 'center',
            sortable: false
          },
          {
            'text': '户籍',
            align: 'center',
            sortable: false
          }, {
            'text': '身份',
            align: 'center',
            sortable: false
          },
          {
            'text': '操作',
            align: 'center',
            sortable: false
          },
        ],
        pagination: {},
        items: [],
        options: [],
        vResult: []
      }
    },

    watch: {
      pagination: {
        handler() {
          // this.getDataFromApi();
        },
        deep: true
      },
      result: {
        handler(newVal, oldVal) {
          if (oldVal) {
          }
        }
      }
    },
    components: {
      VoteResult
    },
    methods: {
      getDataFromApi() {
        this.axios.get('http://api.vote.com/user_findAll', {
          params: {
            page: this.pagination.page, // 当前页
            rows: this.pagination.rows, // 每页大小
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending, // 是否降序
            // search: this.search // 搜索条件
          }
        }).then(msg => {
          console.log(msg)
          this.items = msg.data;
          if (msg.data == null) {
            this.$router.push({path: "/"})
          }
        }).catch(msg => {
          this.$router.push({path: "/"})
        })
      },
      insertItem() {
        console.log(this.radios)
        this.axios({
          url: 'http://api.vote.com/user_updateUserInfo',
          method: 'post',
          data: this.qs.stringify({version: this.radios, id: this.mainInfo.id})
        }).then(msg => {
          if (msg.data == "success") {
            this.show = false;
            this.getDataFromApi();
          }
        }).catch(msg => {
          console.log(msg)
          this.alertShow = true;
          this.alertErrShow = true;
          this.show = false;
          this.$router.push({path: '/'})
        })
      },
      queryResult(subjectId) {
        this.axios({
          url: 'http://api.vote.com/ui_queryResult',
          params: {subjectId: subjectId}
        }).then(msg => {
            this.voteR = true;
            this.vResult = msg.data;
          }
        ).catch(msg => {
          this.$router.push({path: "/"})
        })
      },
      mainVote(userId) {
        this.axios({
          method: 'get',
          url: 'http://api.vote.com/user_mainUser',
          params: {id: userId}
        }).then(msg => {
          this.show = true;
          this.mainInfo = msg.data;
        }).catch(msg => {
          this.$router.push({path: '/'})
        })
      },
    },
    created() {
      this.getDataFromApi();
    }
  }
</script>

<style scoped>

</style>
