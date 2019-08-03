<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
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
              <td class="text-xs-center">{{props.item.subject.beginTime}}</td>
              <td class="text-xs-center">{{props.item.subject.endTime}}</td>
              <td class="text-xs-center">{{ props.item.status }}</td>
              <td>
                <v-switch color="primary" style="margin-top: 30px" :value="props.item.subjectId"
                          v-model="sBtn"
                          :disabled="props.item.subject.endTime.split('-')[1] < new Date().getMonth()+1?true:false || props.item.subject.endTime.split('-')[2] < new Date().getDate()?true:false||props.item.subject.total != 0 ?true:false"
                          @click="mainChange(props.item.subjectId)"></v-switch>
              </td>
              <td class="text-xs-center">
                <v-btn
                  round
                  color="info"
                  dark
                  v-if="sBtn.includes(props.item.subjectId)?true:false"
                  @click="mainVote(props.item.subjectId,props.item.userId)"
                >
                  维护
                </v-btn>
                <p v-else style="margin-top: 20px">{{props.item.status}}</p>
              </td>
            </template>
            <template slot="pageText" slot-scope="props">
              共{{props.itemsLength}}条,当前:{{ props.pageStart }} - {{ props.pageStop }}
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="EditShow" scrollable width="600" v-if="EditShow">
      <v-card>
        <v-toolbar dark dense color="primary">
          <v-toolbar-title>投票维护</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="EditShow = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-5 py-2">
          <main-form :oldForm="mainInfo" @close="EditShow = false" :reload="getDataFromApi"></main-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import MainForm from './MainForm'

  export default {
    components: {
      MainForm
    },
    name: "Vote",
    data() {
      return {
        search: '',
        show: false,
        sBtn: [],
        mainInfo: [],
        mainBtn: false,
        totalItems: 0,// 总条数
        loading: true,
        EditShow: false,
        headers: [
          {
            'text': '投票标题',
            align: 'center',
            sortable: false
          }, {
            'text': '开始时间',
            align: 'center',
            sortable: false
          }, {
            'text': '结束时间',
            align: 'center',
            sortable: false
          },
          {
            'text': '投票状态',
            align: 'center',
            sortable: false
          },
          {
            'text': '是否维护',
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
      }
    },
    watch: {
      pagination: {
        handler() {
          // this.getDataFromApi();
        },
        deep: true
      },
      search: {
        handler() {
          // this.getDataFromApi();
        }
      },
      EditShow: {
        handler(newVal, oldVal) {
          // 表单关闭后重新加载数据
          if (oldVal) {
            this.getDataFromApi();
          }
        }
      }
    },
    methods: {
      getDataFromApi() {
        this.axios.get('http://api.vote.com/us_querySubjectByUser', {
          params: {
            page: this.pagination.page, // 当前页
            rows: this.pagination.rows, // 每页大小
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending, // 是否降序
            search: this.search // 搜索条件
          }
        }).then(msg => {
          console.log(msg.data)
          this.items = msg.data;
          this.loading = false;
          let d = new Date().getDay();
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
              } else if (this.items[i].subject.endTime.split('-')[2] < new Date().getDate()){
                this.items[i]['Stype'] = false;
                this.items[i].status = "已结束";
              } else {
                this.items[i]['Stype'] = true;
                this.items[i].status = "正在投票";
              }
            } else if (this.items[i].status == 1) {
              this.items[i]['Stype'] = false;
              // if (this.sBtn.indexOf(this.items[i].subjectId) != -1) {
              // } else {
              this.sBtn.push(this.items[i].subjectId);
              // }
              this.items[i].status = "维护中";
            } else if (this.items[i].status == 2) {
              // this.items[i]['Stype'] = false;
              this.items[i].status = "已结束"
            }
          }
        }).catch(msg => {
          this.$router.push({path: '/'})
        });
      },
      mainChange(msg) {
        for (let i = 0; i < this.items.length; i++)
          if (this.items[i].subjectId == msg) {
            if (this.items[i].status == '正在投票') {
              this.items[i].status = '维护中'
              this.axios({
                method: 'get',
                url: 'http://api.vote.com/us_updateOptionStatus',
                params: {subjectId: msg, status: 1}
              })
            } else if (this.items[i].status = '维护中') {
              this.items[i].status = '正在投票'
              this.axios({
                method: 'get',
                url: 'http://api.vote.com/us_updateOptionStatus',
                params: {subjectId: msg, status: 0}
              })
            }

          }
        // this.sBtn.remove(msg);
      },
      mainVote(subjectId, userId) {
        this.axios({
          method: 'get',
          url: 'http://api.vote.com/mv_mainVote',
          params: {subjectId: subjectId, userId: userId},
        }).then(msg => {
          this.EditShow = true;
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
