<template>
  <a-layout id="components-layout-demo-custom-trigger" style="min-height: 100vh">
    <a-layout-sider :trigger="null" collapsible v-model="collapsed">
      <div class="logo">
        <p style="font-size: 20px;line-height: 32px;color: azure;text-align: center;margin: 0;">
          <a href style="color:white;" v-if="!collapsed">西城招聘系统</a>
          <a href style="color:white;" v-else>招聘</a>
        </p>
      </div>
      <a-menu theme="dark" mode="inline" :selectedKeys="selectedKeys">
        <a-menu-item :key="item.path" @click="$router.push(item.path)" v-for="item in navMenu">
          <a-icon :type="item.icon" />
          <span>{{item.label}}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="()=> collapsed = !collapsed" />

        <a-dropdown>
          <a class="ant-dropdown-link" href="#" style="float:right;margin-right:20px;color:rgba(0, 0, 0, 0.65);">
            <a-avatar icon="user" :src="photoUrl" />
            {{username}}
          </a>
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="logout">退出</a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', background: '#fff', minHeight: '280px' }">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import * as userApi from "../api/candidateUser";
import { getItem, removeItem } from "../util/cookie";
import Bus from "../bus";
const navMenu = [
  {
    path: "/candidate/job",
    icon: "bars",
    label: "岗位浏览"
  },
  {
    path: "/candidate/recommendJob",
    icon: "bulb",
    label: "推荐岗位"
  },
  {
    path: "/candidate/history",
    icon: "alert",
    label: "应聘记录"
  },
  {
    path: "/candidate/user",
    icon: "user",
    label: "个人中心"
  }
];

export default {
  data() {
    return {
      navMenu,
      collapsed: false,
      username: getItem("candidate-username"),
      photoUrl: getItem("photoUrl_bak")
    };
  },
  created() {
    Bus.$on("candidateUsername", username => {
      this.username = username;
    });
  },
  computed: {
    selectedKeys() {
      const arr = [];
      arr[0] = this.$route.path === "/" ? navMenu[0].path : this.$route.path;
      return arr;
    }
  },
  methods: {
    logout() {
      userApi.logout.r().then(resp => {
        if (resp.data.code === "000000") {
          removeItem("candidate-username");
          removeItem("x-auth-token-candidate");
          this.username = "";

          this.$message.success("退出成功");
          this.$router.push({ name: "candidateLogin" });
        }
      });
    }
  }
};
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
