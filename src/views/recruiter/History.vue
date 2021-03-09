<template>
  <a-card title="应聘记录">
    <div slot="extra">
      <a-button type="primary" @click="getApplicantInfo">导出名单</a-button>
    </div>
    <a-table :dataSource="applyHistoryList" :columns="columns" :rowKey="record => record.id">
      <template slot="candidate" slot-scope="record">
        <a @click="showApplicant(record)">{{record.username}}</a>
      </template>
      <template slot="applyStatus" slot-scope="applyStatus">
        <a-tag v-if="applyStatus=='TODO'" color="blue">批改中</a-tag>
        <a-tag v-else-if="applyStatus=='PASS'" color="green">通过</a-tag>
        <a-tag v-else color="red">不通过</a-tag>
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="showTestContent(record)">查看答题</a>
        <template v-if="record.applyStatus=='TODO'">
          <a-divider type="vertical" />
          <a color="cyan" @click="reviewJobApply(record.jobId,record.userId, true)">通过</a>
          <a-divider type="vertical" />
          <a color="red" @click="reviewJobApply(record.jobId,record.userId, false)">不通过</a>
        </template>
      </span>
    </a-table>
    <a-modal
      title="应聘人详情"
      v-model="user.visible"
      @ok="user.visible=false"
      :closable="false"
      :maskClosable="false"
      width="800px"
    >
      <a-form :form="user.userForm">
        <a-form-item label="用户名">
          <span>{{user.user.username}}</span>
        </a-form-item>
        <a-form-item label="年龄">
          <span>{{user.user.age}}</span>
        </a-form-item>
        <a-form-item label="性别">
          <span>{{user.user.gender===0?'女':'男'}}</span>
        </a-form-item>
        <a-form-item label="联系方式">
          <span>{{user.user.phone}}</span>
        </a-form-item>
        <a-form-item label="Email">
          <span>{{user.user.mail}}</span>
        </a-form-item>
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
import * as recruiterJobApi from "../../api/recruiterJob";

const columns = [
  // {
  //   title: "ID",
  //   dataIndex: "jobId"
  // },
  {
    title: "岗位名称",
    dataIndex: "title"
  },
  {
    title: "申请人",
    dataIndex: "candidate",
    scopedSlots: { customRender: "candidate" }
  },
  {
    title: "申请结果",
    dataIndex: "applyStatus",
    scopedSlots: { customRender: "applyStatus" }
  },
  {
    title: "申请时间",
    dataIndex: "createTime"
  },
  {
    title: "更新时间",
    dataIndex: "updateTime"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    width: 200
  }
];

export default {
  data() {
    return {
      columns,
      applyHistoryList: [],
      user: {
        visible: false,
        user: {}
      }
    };
  },
  mounted() {
    this.getApplyResult();
  },
  methods: {
    getApplyResult() {
      let jobId = this.$router.currentRoute.query.jobId || "";
      let jobQuery = {
        jobId
      };
      recruiterJobApi.getApplyHistory.r(jobQuery).then(resp => {
        if (resp.data.code === "000000") {
          this.applyHistoryList = resp.data.data;
        }
      });
    },
    showApplicant(user) {
      console.log(user);

      this.user.user = user;
      this.user.visible = true;
    },
    showTestContent(record) {
      const h = this.$createElement;
      this.$info({
        title: "答题内容",
        content: h("div", {}, [
          h("h4", "题目："),
          h("pre", record.testContent),
          h("br"),
          h("h4", "答案："),
          h("pre", record.testResult)
        ]),
        width: 800,
        onOk() {}
      });
    },
    reviewJobApply(jobId, applicantId, result) {
      let reviewJobApplyVo = {
        jobId: jobId,
        applicantId: applicantId,
        result: result
      };
      recruiterJobApi.reviewJobApply.r(reviewJobApplyVo).then(resp => {
        if (resp.data.code === "000000") {
          this.getApplyResult();
        }
      });
    },
    getApplicantInfo() {
      function fakeClick(obj) {
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        obj.dispatchEvent(ev);
      }

      function exportRaw(name, data) {
        var urlObject = window.URL || window.webkitURL || window;
        var export_blob = new Blob([data]);
        var save_link = document.createElementNS(
          "http://www.w3.org/1999/xhtml",
          "a"
        );
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        fakeClick(save_link);
      }

      let str = "";
      this.applyHistoryList.forEach(o => {
        if (o.applyStatus == "PASS") {
          str += o.candidate.username + " " + o.candidate.phone + "\r\n";
        }
      });
      exportRaw("名单.txt", str);
    }
  }
};
</script>