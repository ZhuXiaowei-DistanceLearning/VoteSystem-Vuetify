<template>
  <v-form ref="voteForm">
    <v-container>
      <v-layout row>
        <v-flex xs8 offset-xs2>
          <v-text-field
            v-model="Vote.subjectName"
            label="投票标题"
            hint="请输入投票标题"
            :rules="[rules.required]"
            counter="100"
            clearable
          ></v-text-field>
          <v-select
            v-model="select"
            :hint="`${select.value}`"
            :items="items"
            item-text="value"
            item-value="key"
            label="投票类型"
            return-object
            dense>
          </v-select>
          <v-text-field
            label="选项名称"
            hint="请输入选项名称"
            v-for="(optionName,i) in optionNames"
            v-model="optionNames[i]"
            :key="i"
            placeholder="请输入选项名称"
            :rules="[rules.required]"
            counter="200"
            style="position: relative;"
            clearable>
          </v-text-field>
          <v-btn
            dark
            fab
            small
            color="primary"
            absolute
            v-for="(dStyle,i) in deleteBtnTopStyle"
            :key="i"
            @click="deleteNewLine(i)"
            :style="{top:dStyle+'px'}"
            style="right:240px;"
          >
            <v-icon>remove</v-icon>
          </v-btn>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="date"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="date"
                label="请选择开始时间"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable :allowed-dates="allowedDates">
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
          <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="date2"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="date2"
                label="请选择结束时间"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date2" no-title scrollable :allowed-dates="allowedDates">
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.menu2.save(date2)">OK</v-btn>
            </v-date-picker>
          </v-menu>
          <v-btn
            absolute
            dark
            fab
            small
            color="primary"
            @click="insertNewLine"
            style="right:190px;"
            ref="addBtn"
            :style="{top:addBtnTop+'px'}"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <v-btn
            fill-width
            round
            block
            color="primary"
            dark
            @click="insertVote"
          >
            发布投票
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="alertShow" width="1000">
      <v-alert color="success" icon="check_circle" type="success" :value="alertSucShow" dismissible>投票成功</v-alert>
      <v-alert color="error" icon="check_circle" type="error" :value="alertErrShow" dismissible>投票失败
      </v-alert>
    </v-dialog>
  </v-form>
</template>

<script>
    export default {
        name: "VoteForm",
        data() {
            return {
                alertSucShow: false,
                alertErrShow: false,
                alertShow: false,
                Vote: {
                    subjectName: '',
                    optionNames: [],
                    type: '',
                    beginTime: Date,
                    endTime: Date,
                },
                date: new Date().toISOString().substr(0, 10),
                date2: new Date().toISOString().substr(0, 10),
                menu: false,
                menu2: false,
                addBtnTop: 190,
                deleteBtnTop: 190,
                deleteBtnTopStyle: [190],
                optionNames: [''],
                dark: false,
                select: {key: 1, value: '单选'},
                items: [
                    {
                        key: 1,
                        value: '单选'
                    },
                    {
                        key: 2,
                        value: '多选'
                    }
                ],
                rules: {
                    required: value => !!value || '不能为空',
                },
            }
        },
        methods: {
            insertVote() {
                this.Vote.optionNames = this.optionNames
                this.Vote.type = this.select.key;
                this.Vote.beginTime = this.date;
                this.Vote.endTime = this.date2;
                this.axios({
                    url: 'http://api.vote.com/vi_insertVote',
                    method: 'post',
                    data: this.Vote
                }).then(msg => {
                    this.alertShow = true;
                    this.alertSucShow = true;
                    this.show = false;
                }).catch(msg => {
                    this.$router.push({path: '/'})
                })
            },
            insertNewLine() {
                console.log(this.$refs.addBtn.style);
                this.deleteBtnTopStyle.push(this.deleteBtnTop += 68);
                this.addBtnTop += 68;
                this.optionNames.push("");
            },
            deleteNewLine(i) {
                this.addBtnTop -= 68;
                this.deleteBtnTop -= 68;
                this.deleteBtnTopStyle.splice(i, 1);
                this.optionNames.splice(i, 1);
            },
            allowedDates: val => {
                let date = new Date();
                console.log(date.getDay());
                return parseInt(val.split('-')[2], 10) >= date.getDay();
            }
        },
    }
</script>

<style scoped>

</style>
