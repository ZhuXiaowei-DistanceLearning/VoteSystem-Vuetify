<template>
  <v-app id="inspire" ref="NodeData">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      fixed
      app
    >
      <v-list dense>
        <template v-for="item in menuMap">
          <v-layout
            v-if="item.heading"
            :key="item.heading"
            row
            align-center
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            :key="item.title"
            v-model="item.expand"
            :class="[item.expand ? 'nav':'']"
            :prepend-icon="item.icon ? item.icon : item['icon-alt']"
            append-icon=""
            no-action=""
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>
                  {{ item.title }}
                </v-list-tile-title>
                <v-list-tile-action v-if="item.expand">
                  <v-icon>keyboard_arrow_up</v-icon>
                </v-list-tile-action>
                <v-list-tile-action v-else>
                  <v-icon>keyboard_arrow_down</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </template>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              @click=""
              :to=" item.path + child.path"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.title }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :key="item.title" @click="">
            <v-list-tile-action>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.title }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="blue darken-3"
      dark
      app
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">{{title}}</span>
      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-avatar size="32px" tile>
          <img
            src="https://cdn.vuetifyjs.com/images/logos/logo.svg"
            alt="Vuetify"
          >
        </v-avatar>
      </v-btn>
    </v-toolbar>
    <v-content>
      <!--      <v-breadcrumbs>-->
      <!--        <v-breadcrumbs :items="items" divider=">"></v-breadcrumbs>-->
      <!--          <template v-slot:divider>-->
      <!--            <v-icno>forward</v-icno>-->
      <!--          </template>-->
      <!--      </v-breadcrumbs>-->
      <!-- <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>forward</v-icon>
      </template>
    </v-breadcrumbs>-->
      <v-breadcrumbs>
        <template v-slot:divider>
          <v-icon>forward</v-icon>
        </template>
        <v-breadcrumbs-item>{{breads}}</v-breadcrumbs-item>
        <v-breadcrumbs-item>{{breads2}}</v-breadcrumbs-item>
      </v-breadcrumbs>
      <div>
        <router-view></router-view>
      </div>
    </v-content>
  </v-app>
</template>

<script>
  import menus from '../menu'

  export default {
    data() {
      return {
        UserInfo: {},
        drawer: null, // 左侧导航是否隐藏
        drak: false, // 使用应用黑暗主题
        title: "投票管理系统",
        leftNav: false, // 左侧导航是否收起
        menuMap: [],
        data: "hello",
      }
    },
    methods(){

    },
    computed: {
      breads() {
        let path = this.$route.path.split("/");
        this.menuMap.find(function (item, index) {
          if (path[1] == item.path.split("/")[1]) {
            path = item.title;
          }
        });
        return path;
      },
      breads2() {
        let path = this.$route.path.split("/");
        this.menuMap.find(function (item, index) {
          for (let arr of item.children) {
            if (arr.path.split("/")[1] == path[2]) {
              path = arr.title;
            }
          }
        });
        return path;
      }
    },
    props: {
      source: String
    },
    created() {
      // this.menuMap = menus;
      this.axios({
        method:"get",
        url:"http://api.vote.com/findMenu"
      }).then( msg =>{
        console.log(menus);
        console.log("----------");
        this.menuMap = msg.data;
        console.log(msg)
      }).catch(msg => {
        this.$router.push({path: "/"})
      })
    }
  }
</script>

<style>
</style>
