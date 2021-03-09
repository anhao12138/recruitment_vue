<template>
  <a-card title="推荐岗位列表 - 根据应聘人员信息推荐">
    <a-table :dataSource="myJobList" :columns="columns" :rowKey="record => record.id">
      <a slot="companyInfo" slot-scope="companyInfo,record" @click="showCompanyInfo(record.id)">{{record.companyName}}</a>
      <span slot="action" slot-scope="text, record">
        <a v-if="record.canApply" @click="showApply(record.id)">应聘</a>
        <a v-else @click="showApplyResult(record.id)">查看结果</a>
      </span>
    </a-table>
    <a-modal
      :title="`应聘该岗位:  ${jobDetail.detail.title}`"
      v-model="newJob.visible"
      @ok="handleApply"
      :closable="false"
      :maskClosable="false"
      width="800px"
    >
      <a-form :form="newJob.jobForm">
        <a-form-item label="试题内容">
          <pre>{{jobDetail.detail.testContent}}</pre>
        </a-form-item>
        <a-form-item label="答案">
          <a-textarea
            :autosize="{ minRows: 6, maxRows: 12 }"
            v-decorator="['testResult',{ rules: [{ required: true, message: 'Please input job test result!' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import * as candidateJobApi from "../../api/candidateJob";
import { getItem, removeItem } from "../../util/cookie";

const columns = [
  // {
  //   title: "ID",
  //   dataIndex: "id",
  //   width: 50
  // },
  {
    title: "岗位名称",
    dataIndex: "title",
    width: 150
  },
  {
    title: "公司",
    dataIndex: "companyName",
    scopedSlots: { customRender: "companyInfo" },
    width: 100
  },
  {
    title: "描述",
    dataIndex: "description"
    // width: 250
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    width: 180,
    scopedSlots: { customRender: "createTime" }
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    width: 120
  }
];

export default {
  data() {
    return {
      columns,
      myJobList: [],
      myJobMap: {},
      jobDetail: {
        detail: {}
      },
      newJob: {
        visible: false,
        jobForm: this.$form.createForm(this)
      }
    };
  },
  mounted() {
    this.listJob();
    const that = this;

    let username = getItem("candidate-username");
    let firstLogin = getItem("candidate-" + username + "-fitstLogin");

    if (firstLogin && firstLogin === "true") {
      const h = this.$createElement;
      this.$info({
        title: "首次登录提示",
        content: h("div", {}, [
          h("p", "这是您第一次登录本系统，请先完善个人信息!")
        ]),
        onOk() {
          removeItem("candidate-" + username + "-fitstLogin");
          that.$router.replace({
            name: "candidateUser"
          });
        }
      });
    }
  },
  methods: {
    showCompanyInfo(jobId) {
      let companyInfo = this.myJobMap[jobId];

      if (companyInfo) {
        const h = this.$createElement;
        this.$info({
          title: "公司简介：" + companyInfo.companyName,
          content: h("div", {}, [h("p", companyInfo.companyDesc)]),
          onOk() {},
          width: 800
        });
      }
    },
    listJob() {
      candidateJobApi.listRecommendJob.r().then(resp => {
        if (resp.data.code === "000000") {
          this.myJobList = resp.data.data;
          this.myJobList.forEach(job => {
            this.myJobMap[job.id] = job;
          });
        }
      });
    },
    showApply(jobId) {
      this.jobDetail.detail = this.myJobMap[jobId];
      this.newJob.visible = true;
    },
    showApplyResult(jobId) {
      this.$router.push({
        name: "candidateHistory",
        query: {
          jobId: jobId
        }
      });
    },
    handleApply(e) {
      e.preventDefault();
      this.newJob.jobForm.validateFields((err, values) => {
        if (!err) {
          let jobApplyVo = {
            jobId: this.jobDetail.detail.id,
            testResult: values.testResult
          };
          candidateJobApi.applyJob.r(jobApplyVo).then(resp => {
            if (resp.data.code === "000000") {
              this.newJob.visible = false;
              this.$message.info("操作成功!");
            }
          });
        }
      });
    }
  }
};
</script>