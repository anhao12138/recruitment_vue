<template>
  <a-card title="应聘人员列表">
    <div slot="extra">
      <!-- <a-button type="primary" @click="newJob.visible=true" style="margin: 0 8px 0 0;">发布招聘信息</a-button> -->
    </div>
    <a-table :dataSource="userList" :columns="columns" :rowKey="record => record.id">
      <span slot="gender" slot-scope=" record">{{record===0?'女':'男'}}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="showUserDetail(record.id)">查看详情</a>
      </span>
    </a-table>
    <a-modal
      title="更多详情"
      v-model="user.visible"
      @ok="user.visible=false"
      :closable="false"
      :maskClosable="false"
      width="800px"
    >
      <a-form :form="user.userForm">
        <a-form-item label="教育经历">
          <span>{{user.user.education}}</span>
        </a-form-item>
        <a-form-item label="工作经验">
          <span>{{user.user.workExperience}}</span>
        </a-form-item>
        <a-form-item label="项目经验">
          <span>{{user.user.projectExperience}}</span>
        </a-form-item>
        <a-form-item label="语言能力">
          <span>{{user.user.language}}</span>
        </a-form-item>
        <a-form-item label="专业技能">
          <span>{{user.user.professionalSkill}}</span>
        </a-form-item>
        <a-form-item label="自我评价">
          <span>{{user.user.selfEvaluation}}</span>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import * as adminUserApi from "../../api/adminUser";

const columns = [
  // {
  //   title: "ID",
  //   dataIndex: "id",
  //   width: 80
  // },
  {
    title: "用户",
    dataIndex: "username",
    width: 100
  },
  {
    title: "性别",
    dataIndex: "gender",
    scopedSlots: { customRender: "gender" }
    // width: 80
  },
  {
    title: "年龄",
    dataIndex: "age"
    // width: 80
  },
  {
    title: "Phone",
    dataIndex: "phone"
    // width: 100
  },
  {
    title: "Mail",
    dataIndex: "mail"
    // width: 120
  },
  {
    title: "注册时间",
    dataIndex: "createTime",
    width: 180
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
    // width: 200
  }
];

export default {
  data() {
    return {
      columns,
      userList: [],
      userMap: {},
      user: {
        visible: false,
        user: {}
      }
    };
  },
  mounted() {
    this.listUser();
  },
  methods: {
    listUser() {
      adminUserApi.listUser.r("APPLICANT").then(resp => {
        if (resp.data.code === "000000") {
          this.userList = resp.data.data;
          this.userList.forEach(user => {
            this.userMap[user.id] = user;
          });
        }
      });
    },
    showUserDetail(userId) {
      this.user.user = this.userMap[userId];
      this.user.visible = true;
    }
  }
};
</script>