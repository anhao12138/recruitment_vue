<template>
  <a-card title="应聘记录">
    <a-table
      :dataSource="applyResultList"
      :columns="columns"
      :rowKey="record => record.jobId+record.userId+record.title"
    >
      <template slot="applyStatus" slot-scope="applyStatus">
        <a-tag v-if="applyStatus=='TODO'" color="blue">批改中</a-tag>
        <a-tag v-else-if="applyStatus=='PASS'" color="green">通过</a-tag>
        <a-tag v-else color="red">不通过</a-tag>
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="showTestContent(record)">查看答题</a>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import * as candidateJobApi from "../../api/candidateJob";

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
    width: 100
  }
];

export default {
  data() {
    return {
      columns,
      applyResultList: []
    };
  },
  mounted() {
    let jobId = this.$router.currentRoute.query.jobId;
    this.getApplyResult(jobId || "");
  },
  methods: {
    getApplyResult(jobId) {
      let jobQuery = {
        jobId
      };
      candidateJobApi.getApplyResult.r(jobQuery).then(resp => {
        if (resp.data.code === "000000") {
          this.applyResultList = resp.data.data;
        }
      });
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
    }
  }
};
</script>