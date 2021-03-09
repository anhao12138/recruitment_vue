<template>
  <a-card title="招聘信息">
    <div slot="extra">
      <!-- <a-button type="primary" @click="newJob.visible=true" style="margin: 0 8px 0 0;">发布招聘信息</a-button> -->
    </div>
    <a-table :dataSource="myJobList" :columns="columns" :rowKey="record => record.id">
      <a slot="companyInfo" slot-scope="companyInfo,record" @click="showCompanyInfo(record.id)">{{record.companyName}}</a>
      <template slot="status" slot-scope="status">
        <a-tag v-if="status=='TODO'" color="blue">待审核</a-tag>
        <a-tag v-else-if="status=='PASS'" color="green">已发布</a-tag>
        <a-tag v-else color="red">不通过</a-tag>
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="showJobDetail(record.id)">查看试题</a>
        <template v-if="record.status=='TODO'">
          <a-divider type="vertical" />
          <a color="cyan" @click="handleReview(record.id, true)">通过</a>
          <a-divider type="vertical" />
          <a color="red" @click="handleReview(record.id, false)">不通过</a>
        </template>
      </span>
    </a-table>
    <a-modal
      title="试题内容"
      v-model="jobDetail.visible"
      @ok="jobDetail.visible=false"
      :closable="false"
      :maskClosable="false"
      width="800px"
    >
      <!-- <h3>岗位描述：</h3>
      <p>{{jobDetail.detail.description}}</p>-->
      <!-- <h3>试题内容：</h3> -->
      <pre>{{jobDetail.detail.testContent}}</pre>
    </a-modal>
    <a-modal title="发布招聘信息" v-model="newJob.visible" @ok="postJob" :closable="false" :maskClosable="false">
      <a-form :form="newJob.jobForm">
        <a-form-item label="岗位名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input v-decorator="['title',{ rules: [{ required: true, message: 'Please input job title!' }] }]" />
        </a-form-item>
        <a-form-item label="岗位描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-textarea
            :autosize="{ minRows: 4, maxRows: 6 }"
            v-decorator="['description',{ rules: [{ required: true, message: 'Please input job description!' }] }]"
          />
        </a-form-item>
        <a-form-item label="试题内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-textarea
            :autosize="{ minRows: 6, maxRows: 12 }"
            v-decorator="['testContent',{ rules: [{ required: true, message: 'Please input job test content!' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import * as adminJobApi from "../../api/adminJob";

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
    title: "状态",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
    width: 50
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
    width: 200
  }
];

export default {
  data() {
    return {
      columns,
      myJobList: [],
      myJobMap: {},
      jobDetail: {
        visible: false,
        detail: {}
      },
      newJob: {
        visible: false,
        jobForm: this.$form.createForm(this)
      }
    };
  },
  mounted() {
    this.listMyJob();
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
    listMyJob() {
      adminJobApi.listJob.r().then(resp => {
        if (resp.data.code === "000000") {
          this.myJobList = resp.data.data;
          this.myJobList.forEach(job => {
            this.myJobMap[job.id] = job;
          });
        }
      });
    },
    showJobDetail(jobId) {
      this.jobDetail.detail = this.myJobMap[jobId];
      this.jobDetail.visible = true;
    },
    handleReview(jobId, result) {
      let reviewJobVo = {
        jobId: jobId,
        result: result
      };
      adminJobApi.reviewJob.r(reviewJobVo).then(resp => {
        if (resp.data.code === "000000") {
          this.$message.info("操作成功");
          this.listMyJob();
        }
      });
    },
    postJob(e) {}
  }
};
</script>