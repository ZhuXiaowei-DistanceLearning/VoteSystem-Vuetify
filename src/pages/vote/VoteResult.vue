<template>
  <div class="service_area">
    <div class="row">
      <div class="skills_bar_design">
        <div class="progress-bar-linear" v-for="(list,i) in lists" :key="i">
          <p class="progress-bar-text">{{list.name}} <span class="float_right"></span></p>
          <div class="progress-bar">
            <span :data-percent="list.num/total*100"></span><h5>投票数为:{{list.num}}</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "VoteResult",
    props: {
      vResult: Array
    },
    data() {
      return {
        show: true,
        lists: [],
        total: 0
      }
    },
    methods: {
      init() {
        $(".progress-bar > span").each(function () {
          let $this = $(this);
          let width = 0;
          console.log($this.data('percent') / this.total)
          let timer = setInterval(initData, 50);

          function initData() {
            $this.css('width', function () {
              // $this[0].innerHTML = width;
              $this.parent().prev().children("span").html(width + '%');
              if (width >= parseInt($this.data('percent'))) {
                clearInterval(timer)
              }
              return width + '%';
            });
            width++;
          }

          timer;
        })
      }
    },
    watch: {
      vResult: {
        deep: true,
        handler(newVal, oldVal) {
          this.lists = newVal;
          for (let arr of newVal) {
            this.total = this.total + arr.num;
          }
        },
        immediate: true
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>
  section {
    width: 1200px;
    padding: 60px 0px;
    margin: 20px auto;
    min-height: 100px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .5);
    position: relative;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .section_title {
    margin-bottom: 50px;
    margin-top: 0;
  }

  .section_title h2 {
    color: #333333;
    font-size: 25px;
    font-weight: 700;
    letter-spacing: 1.8px;
  }

  .section_title p {
    color: #333333;
    font-size: 14px;
    line-height: 25px;
    padding: 14px 0;
  }

  .progress-bar {
    background: #ddd;
    box-shadow: 0 0 0;
    height: 5px;
    margin: 0 0 45px;
    position: relative;
    width: 80%;
    border-radius: 5px;
  }

  .progress-bar-text {
    color: #333333;
    font-size: 15px;
    margin-bottom: 9px;
  }

  .progress-bar > span {
    display: block;
    height: 100%;
    width: 0px;
    border-radius: 5px;
  }

  .progress-bar > span {
    background: #F8C01B;
    background-image: linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55);
  }

  section:hover .cover {
    opacity: 1;
    transform: scaleY(1);
  }
</style>
