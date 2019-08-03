<template>
  <v-form ref="oldForm" v-model="valid">
    <v-text-field
      v-model="newForm[0].title"
      label="投票标题"
      hint="请输入投票标题"
      :rules="[rules.required]"
      counter="100"
      clearable
    ></v-text-field>
    <v-select
      v-model="newForm[0].type"
      :items="items"
      item-text="value"
      item-value="key"
      label="投票类型"
      return-object
      dense>
    </v-select>
    <v-text-field
      label="选项名称"
      v-for="(item,key) in newForm"
      hint="请输入选项名称"
      :key="key"
      key="username-input "
      v-model="item.name"
      :rules="[rules.required]"
      counter="200"
      return-object
      clearable>
    </v-text-field>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="newForm[0].beginTime"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="newForm[0].beginTime"
          label="请选择开始时间"
          prepend-icon="event"
          readonly
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="newForm[0].beginTime" no-title scrollable :allowed-dates="allowedDates">
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs.menu.save(newForm[0].beginTime)">OK</v-btn>
      </v-date-picker>
    </v-menu>
    <v-menu
      ref="menu2"
      v-model="menu2"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="newForm[0].endTime"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="newForm[0].endTime"
          label="请选择结束时间"
          prepend-icon="event"
          readonly
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="newForm[0].endTime" no-title scrollable :allowed-dates="allowedDates">
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs.menu2.save(newForm[0].endTime)">OK</v-btn>
      </v-date-picker>
    </v-menu>
    <v-btn
      fill-width
      round
      block
      color="primary"
      dark
      @click="submit"
    >
      提交
    </v-btn>
    <v-dialog v-model="alertShow" width="1000">
      <v-alert color="success" icon="check_circle" type="success" :value="alertSucShow" dismissible>投票成功</v-alert>
      <v-alert color="error" icon="check_circle" type="error" :value="alertErrShow" dismissible>投票失败
      </v-alert>
    </v-dialog>
  </v-form>
</template>

<script>
  export default {
    name: "MainForm",
    props: {
      oldForm: Array,
      EditShow: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        valid: true,
        newForm: [],
        rules: {
          required: value => !!value || "不能为空",
        },
        menu: false,
        menu2: false,
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
        alertSucShow: false,
        alertErrShow: false,
        alertShow: false,
      }
    },
    watch: {
      oldForm: {
        deep: true,
        handler(newName, oldName) {
          console.log(newName)
          this.newForm = newName;
        },
        immediate: true
      }
    },
    methods: {
      submit() {
        this.axios({
          method: "post",
          url: "http://api.vote.com/mv_updateVoteInfo",
          data: this.newForm[0]
        }).then(msg => {
          if (msg.status) {
            this.alertShow = true;
            this.alertSucShow = true;
            this.closeWindow();
          }
          console.log(msg)
        }).catch(msg => {
          this.alertShow = true;
          this.alertErrShow = true;
        })
      },
      closeWindow() {
        this.$emit("close");
      },
      allowedDates: val => {
        let date = new Date();
        console.log(date.getDay());
        return parseInt(val.split('-')[2], 10) >= date.getDay();
      }
    }
  }
</script>

<style scoped>

</style>
