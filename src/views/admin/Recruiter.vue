<template>
  <a-card title="招聘人员列表">
    <div slot="extra">
      <!-- <a-button type="primary" @click="newJob.visible=true" style="margin: 0 8px 0 0;">发布招聘信息</a-button> -->
    </div>
    <a-table :dataSource="userList" :columns="columns" :rowKey="record => record.id"></a-table>
  </a-card>
</template>

<script>
import * as adminUserApi from "../../api/adminUser";

const columns = [
  // {
  //   title: "ID",
  //   dataIndex: "id",
  //   width: 50
  // },
  {
    title: "用户",
    dataIndex: "username",
    width: 100
  },
  {
    title: "公司名称",
    dataIndex: "companyName",
    width: 150
  },
  {
    title: "公司描述",
    dataIndex: "companyDesc"
    // width: 250
  },
  {
    title: "注册时间",
    dataIndex: "createTime",
    width: 180
  }
];

export default {
  data() {
    return {
      columns,
      userList: [],
      userMap: {}
    };
  },
  mounted() {
    this.listUser();
  },
  methods: {
    listUser() {
      adminUserApi.listUser.r("RECRUITER").then(resp => {
        if (resp.data.code === "000000") {
          this.userList = resp.data.data;
          this.userList.forEach(user => {
            this.userMap[user.id] = user;
          });
        }
      });
    }
  }
};
</script>