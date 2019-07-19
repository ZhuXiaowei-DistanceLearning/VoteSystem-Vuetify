<template>
  <v-container>
    <v-layout row>
      <v-flex offset-lg1 offset-xs1 xs10>
        <v-date-picker
          v-model="picker"
          full-width
          landscape
          class="mt-3">
        </v-date-picker>
      </v-flex>
    </v-layout>
    <v-layout justify-center row style="margin-top: 50px">
      <v-flex xs4 shrink offset-xs1>
        <v-card>
          <v-img src="../../static/img/desert.jpg"
                 aspect-ratio="2.75"></v-img>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">投票管理系统</h3>
              <h4 class="headline mb-0">欢迎你: {{ UserInfo.name }}</h4>
              <h5 class="headline mb-0">你的身份是: {{ UserInfo.qx=='1'?'管理员':'会员' }}</h5>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <!--<v-flex xs6 sm6 offset-xs1>
        <v-time-picker
          v-model="time"
          :allowed-hours="allowedHours"
          :allowed-minutes="allowedMinutes"
          class="mt-3"
          format="24hr"
          scrollable
          width="300"
        ></v-time-picker>
      </v-flex>-->
      <v-flex xs7 shrink>
       <!-- <v-data-table
          :headers="headers"
          :items="desserts"
          class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.calories }}</td>
            <td class="text-xs-right">{{ props.item.fat }}</td>
            <td class="text-xs-right">{{ props.item.carbs }}</td>
            <td class="text-xs-right">{{ props.item.protein }}</td>
            <td class="text-xs-right">{{ props.item.iron }}</td>
          </template>
        </v-data-table>-->
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <!--<v-data-table
          :headers="headers"
          :items="desserts"
          class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.calories }}</td>
            <td class="text-xs-right">{{ props.item.fat }}</td>
            <td class="text-xs-right">{{ props.item.carbs }}</td>
            <td class="text-xs-right">{{ props.item.protein }}</td>
            <td class="text-xs-right">{{ props.item.iron }}</td>
          </template>
        </v-data-table>-->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        time: "",
        timeStep: "",
        picker: new Date().toISOString().substr(0, 10),
        UserInfo: {
          id:'',
          name:'',
          qx:''
        }
      }
    },
    methods: {
      allowedHours: v => v % 2,
      allowedMinutes: v => v >= 10 && v <= 50,
      allowedStep: m => m % 10 === 0
    },
    created() {
      let d = new Date();
      let date = d.getHours() + ":" + d.getMinutes();
      this.time = date;
      this.axios.get("http://api.vote.com/verify").then(msg => {
        if (msg.data != "error" || msg == null) {
          this.UserInfo.name = msg.data.username;
          this.UserInfo.id = msg.data.id;
          this.UserInfo.qx = msg.data.qx;
          this.$route.meta.UserInfo = 'aa';
        }else{
          this.$router.push({path:"/"})
        }
      }).catch(
        msg =>{
          this.$router.push({path:"/"})
        }
      );
    }
  }
</script>
