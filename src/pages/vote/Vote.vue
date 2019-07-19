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
            no-data-text="暂时没有票可以投"
            class="elevation-1">
            <template v-slot:items="props">
              <td class="text-xs-center">{{props.item.subject.title}}</td>
              <td class="text-xs-center">{{ props.item.subject.type==1?'单选':'多选' }}</td>
              <td class="text-xs-center">{{ props.item.status }}</td>
              <td class="text-xs-center">{{ props.item.user.username }}</td>
              <td class="text-xs-center">{{ props.item.subject.beginTime}}</td>
              <td class="text-xs-center">{{ props.item.subject.endTime }}</td>
              <td class="text-xs-center">
                <p
                  v-if="isVote?'你已投过票':false"
                >
                  你已投过票
                </p>
                <v-btn
                  round
                  color="info"
                  dark
                  v-else-if="props.item.status=='正在进行'"
                  @click="voting(props.item.subjectId)"
                >
                  投票
                </v-btn>
                  <p v-else style="margin-top: 20px">{{props.item.status}}</p>
                <v-btn
                  round
                  color="info"
                  dark
                  v-if="props.item.status!='维护中'"
                  @click="queryResult(props.item.subjectId)"
                >
                  查看结果
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
                <p>{{radios.name}}</p>
                <p>选择方式：{{radios.type==1 ?'单选':'多选'}}</p>
                <v-radio-group v-model="optionId" :mandatory="false"
                               hint="请选择一项" flat style="margin-top: 20px">
                  <v-radio v-for="(option,index) in options" :key="option.id" :label="option.name" :value="option.id"
                           color="success" hide-details></v-radio>
                </v-radio-group>
                <v-btn
                  round
                  dark
                  @click="insertItem"
                  color="info"
                  style="margin-left:150px">投票
                </v-btn>
              </v-container>
            </v-card>
          </v-dialog>
          <v-dialog v-model="alertShow" width="1000">
            <v-alert color="success" icon="check_circle" type="success" :value="alertSucShow" dismissible>投票成功</v-alert>
            <v-alert color="error" icon="check_circle" type="error" :value="alertErrShow" dismissible>投票失败
            </v-alert>
          </v-dialog>
          <v-dialog v-model="voteR" scrollable width="600" v-if="voteR">
            <v-card>
              <v-toolbar dark dense color="primary">
                <v-toolbar-title>
                  投票结果查询
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="voteR = false">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <vote-result :vResult="vResult"></vote-result>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import VoteResult from './VoteResult'

  export default {
    name: "Vote",
    data() {
      return {
        search: '',
        show: false,
        radios: {
          name: '',
          type: '',
          id: ''
        },
        isVote:false,
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
            'text': '投票标题',
            align: 'center',
            sortable: false
          },
          {
            'text': '投票类型',
            align: 'center',
            sortable: false
          },
          {
            'text': '状态',
            align: 'center',
            sortable: false
          },
          {
            'text': '发起人',
            align: 'center',
            sortable: false
          },
          {
            'text': '开始时间',
            align: 'center',
            sortable: false
          },{
            'text': '结束时间',
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
        this.axios.get('http://api.vote.com/vote/findAll', {
          params: {
            page: this.pagination.page, // 当前页
            rows: this.pagination.rows, // 每页大小
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending, // 是否降序
            // search: this.search // 搜索条件
          }
        }).then(msg => {
          this.items = msg.data;
          this.loading = false;
          for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].status == 0) {
              if (this.items[i].subject.beginTime.split('-')[1] > new Date().getMonth() + 1) {
                this.items[i]['Stype'] = false;
                this.items[i].status = "还未开始";
              } else if (this.items[i].subject.beginTime.split('-')[1] < new Date().getMonth() + 1) {
                this.items[i]['Stype'] = false;
                this.items[i].status = "已结束";
              } else if (this.items[i].subject.beginTime.split('-')[2] > new Date().getDate()) {
                this.items[i]['Stype'] = false;
                this.items[i].status = "还未开始";
              } else if (this.items[i].subject.endTime.split('-')[2] < new Date().getDate()) {
                this.items[i]['Stype'] = false;
                this.items[i].status = "已结束";
              } else {
                this.items[i]['Stype'] = true;
                this.items[i].status = "正在进行";
              }
            }
            if (this.items[i].status == 0) {
              this.items[i].status = "正在进行"
            } else if (this.items[i].status == 1) {
              this.items[i].status = "维护中"
            } else if (this.items[i].status == 2) {
              this.items[i].status = "已结束"
            }
          }
        }).catch(msg => {
          this.$router.push({path: "/"})
        })
      },
      voting(id) {
        this.axios({
          url: 'http://api.vote.com/vote/voting?id=' + id,
        }).then(msg => {
          this.options = msg.data;
          this.show = true;
          this.radios.name = this.options[0].subject.title;
          this.radios.type = this.options[0].subject.type;
          this.subjectId = this.options[0].subjectId;
        }).catch(msg => {
          this.$router.push({path: '/'})
        })
      },
      insertItem() {
        console.log(this.radios)
        this.axios({
          url: 'http://api.vote.com/vote/insertItem',
          method: 'post',
          data: this.qs.stringify({radios: this.optionId, subjectId: this.subjectId})
        }).then(msg => {
          if (msg.data == "success") {
            this.alertShow = true;
            this.alertSucShow = true;
            this.show = false;
          } else {
            this.alertShow = true;
            this.alertErrShow = true;
            this.show = false;
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
          url: 'http://api.vote.com/vote/queryResult',
          params: {subjectId: subjectId}
        }).then(msg => {
            this.voteR = true;
            this.vResult = msg.data;
          }
        ).catch(msg => {
          this.$router.push({path: "/"})
        })
      }
    },
    created() {
      this.getDataFromApi();
    }
  }
</script>

<style scoped>

</style>
