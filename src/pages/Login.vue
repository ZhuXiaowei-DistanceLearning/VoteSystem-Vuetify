<template>
  <v-app>
    <v-container fluid>
      <v-layout align-center column>
        <img src="../../static/img/logo.png"/>
        <v-flex xs5>
          <v-tabs
            centered
            color="cyan"
            dark
            icons-and-text>
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab href="#tab-1">
              登录
            </v-tab>
            <v-tab href="#tab-2">
              注册
            </v-tab>
            <v-tab-item
              v-for="i in 2"
              :key="i"
              :value="'tab-' + i"
            >
              <v-card v-if="i == 1">
                <v-card-title primary-title>
                  <v-form
                    ref="form">
                    <v-text-field
                      v-model="User.username"
                      label="用户名"
                      hint="请输入用户名"
                      name="username"
                      color="blue"
                      clearable>
                    </v-text-field>
                    <v-text-field
                      v-model="User.password"
                      label="密码"
                      name="password"
                      :append-icon="show ? 'visibility' : 'visibility_off'"
                      counter
                      color="blue"
                      :rules="[rules.required]"
                      :type="show ? 'text':'password'"
                      @click:append="show = !show"
                      hint="请输入密码">
                    </v-text-field>
                    <v-btn round color="primary" @click="formSubmit">登录</v-btn>
                  </v-form>
                </v-card-title>
              </v-card>
              <v-card v-else>
                <v-card-title primary-title>
                  <v-form
                    ref="form">
                    <v-text-field
                      v-model="User.username"
                      label="用户名"
                      hint="请输入用户名"
                      name="username"
                      color="blue"
                      clearable>
                    </v-text-field>
                    <v-text-field
                      v-model="User.password"
                      label="密码"
                      name="password"
                      :append-icon="show ? 'visibility' : 'visibility_off'"
                      counter
                      color="blue"
                      :rules="[rules.required]"
                      :type="show ? 'text':'password'"
                      @click:append="show = !show"
                      hint="请输入密码">
                    </v-text-field>
                    <v-radio-group v-model="User.gender" row>
                      <v-radio label="男" value="1"></v-radio>
                      <v-radio label="女" value="2"></v-radio>
                    </v-radio-group>
                    <v-text-field
                      v-model="User.age"
                      label="年龄"
                      name="password"
                      counter
                      color="blue"
                      :rules="[rules.required]"
                      hint="请输入年龄">
                    </v-text-field>
                    <v-text-field
                      v-model="User.region"
                      label="地区"
                      name="password"
                      counter
                      color="blue"
                      :rules="[rules.required]"
                      hint="请输入地区">
                    </v-text-field>
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
                          label="选择年龄"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="date" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                    <v-btn round color="primary" @click="register">注册</v-btn>
                  </v-form>
                </v-card-title>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        show: false,
        User: {
          username: "",
          password: "",
          age:'',
          gender:'',
          region:'',
          birthday:''
        },
        date: new Date().toISOString().substr(0, 10),
        menu: false,
        rules: {
          required: value => !!value || "不能为空",
        }
      }
    },
    name: "Login",
    methods: {
      formSubmit() {
        this.axios({
          method: 'post',
          url: 'http://api.vote.com/login',
          data: this.qs.stringify(this.User)
        }).then(msg => {
          if (msg != null || msg != '') {
            this.$router.push({path:"/Layout"})
          }
        });
      },
      register() {
        this.User.birthday = this.date;
        this.axios({
          method: 'post',
          url: 'http://api.vote.com/register',
          data: this.qs.stringify(this.User)
        }).then(msg => {
          if (msg != null || msg != '') {
            window.location.reload();
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
