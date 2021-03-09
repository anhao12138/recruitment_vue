<template>
  <a-card title="我的招聘">
    <div slot="extra">
      <a-button type="primary" @click="newJob.visible=true">发布招聘信息</a-button>
    </div>
    <a-table :dataSource="myJobList" :columns="columns" :rowKey="record => record.id">
      <template slot="status" slot-scope="status">
        <a-tag v-if="status=='TODO'" color="blue">审核中</a-tag>
        <a-tag v-else-if="status=='PASS'" color="green">已发布</a-tag>
        <a-tag v-else color="red">审核不通过</a-tag>
      </template>
      <span slot="action" slot-scope="record">
        <a @click="showJobDetail(record.id)">查看试题</a>
        <a-divider type="vertical" />
        <a v-if="record.status=='PASS'" @click="showApplyHistory(record.id)">申请记录</a>
        <a-divider type="vertical" />
        <a @click="updateJob.visible=true;updateJob.job=record;">更新</a>
        <a-divider type="vertical" />
        <a @click="delJob(record.id)">删除</a>
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
    <a-modal
      id="jobForm1"
      title="发布招聘信息"
      v-model="newJob.visible"
      @ok="postJob"
      :closable="false"
      :maskClosable="false"
      width="800px"
    >
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
    <a-modal
      id="jobForm2"
      title="更新招聘信息"
      v-model="updateJob.visible"
      @ok="updateJobF"
      :closable="false"
      :maskClosable="false"
      width="800px"
    >
      <a-form :form="updateJob.jobForm">
        <a-form-item label="岗位ID" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input disabled v-decorator="['jobId',{initialValue:updateJob.job.id }]" />
        </a-form-item>
        <a-form-item label="岗位名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input
            v-decorator="['title',{initialValue:updateJob.job.title, rules: [{ required: true, message: 'Please input job title!' }] }]"
          />
        </a-form-item>
        <a-form-item label="岗位描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-textarea
            :autosize="{ minRows: 4, maxRows: 6 }"
            v-decorator="['description',{initialValue:updateJob.job.description, rules: [{ required: true, message: 'Please input job description!' }] }]"
          />
        </a-form-item>
        <a-form-item label="试题内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-textarea
            :autosize="{ minRows: 6, maxRows: 12 }"
            v-decorator="['testContent',{initialValue:updateJob.job.testContent, rules: [{ required: true, message: 'Please input job test content!' }] }]"
          />
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
  //   dataIndex: "id",
  //   width: 50
  // },
  {
    title: "岗位名称",
    dataIndex: "title",
    width: 150
  },
  {
    title: "描述",
    dataIndex: "description"
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
    // sorter: (a, b) => a.createTime - b.createTime,
    scopedSlots: { customRender: "createTime" }
  },
  {
    title: "操作",
    key: "action",
    width: 260,
    scopedSlots: { customRender: "action" }
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
      },
      updateJob: {
        visible: false,
        job: {},
        jobForm: this.$form.createForm(this)
      }
    };
  },
  mounted() {
    this.listMyJob();
  },
  methods: {
    listMyJob() {
      recruiterJobApi.listMyJob.r().then(resp => {
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
    showApplyHistory(jobId) {
      this.$router.push({
        name: "recruiterHistory",
        query: {
          jobId: jobId
        }
      });
    },
    postJob(e) {
      e.preventDefault();
      this.newJob.jobForm.validateFields((err, values) => {
        if (!err) {
          let newJobVo = {
            title: values.title,
            description: values.description,
            testContent: values.testContent
          };
          recruiterJobApi.postJob.r(newJobVo).then(resp => {
            if (resp.data.code === "000000") {
              this.newJob.visible = false;
              this.newJob.jobForm.resetFields();
              this.$message.info("添加成功!");

              this.listMyJob();
            }
          });
        }
      });
    },
    updateJobF(e) {
      e.preventDefault();
      this.updateJob.jobForm.validateFields((err, values) => {
        if (!err) {
          let updateJobVo = {
            jobId: values.jobId,
            title: values.title,
            description: values.description,
            testContent: values.testContent
          };
          recruiterJobApi.updateJob.r(updateJobVo).then(resp => {
            if (resp.data.code === "000000") {
              this.updateJob.visible = false;
              this.$message.info("更新成功!");

              this.listMyJob();
            }
          });
        }
      });
    },
    delJob(jobId) {
      recruiterJobApi.delJob.r(jobId).then(resp => {
        if (resp.data.code === "000000") {
          this.newJob.visible = false;
          this.$message.info("删除成功!");

          this.listMyJob();
        }
      });
    }
  }
};
</script>