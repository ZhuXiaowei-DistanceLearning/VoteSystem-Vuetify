var menus = [
  {
    title: "首页",
    path: "/index",
    icon:"home",
    expand:true,
    children: [
      {
        icon:"chat_bubble",
        title: "主页",
        path: "/dashboard"
      }
    ]
  },
  {
    title: "管理员管理",
    path: "/role",
    icon:"home",
    children: [
      {
        icon:"chat_bubble",
        title: "角色管理",
        path: "/findAll"
      }
    ]
  },
  {
    title: "投票标题管理",
    path: "/vote",
    icon:"home",
    children: [
      {
        icon:"chat_bubble",
        title: "发布新投票",
        path: "/pubVote"
      },{
        icon:"chat_bubble",
        title: "投票",
        path: "/vote"
      },{
        icon:"chat_bubble",
        title: "维护投票",
        path: "/maintainVote"
      },{
        icon:"chat_bubble",
        title: "投票查询",
        path: "/findAll"
      }
    ]
  },
  {
    title: "系统管理",
    path: "/system",
    icon:"home",
    children: [
      {
        icon:"chat_bubble",
        title: "主页",
        path: "/dashboard"
      }
    ]
  }
]
export default menus;


