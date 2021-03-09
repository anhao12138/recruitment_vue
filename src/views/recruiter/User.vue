<template>
  <a-card title="个人信息">
    <a-form :form="userForm" @submit="handleUpdate">
      <!-- <a-form-item label="ID" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-input :value="user.id" disabled />
      </a-form-item> -->
      <a-form-item label="账号" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-input :value="user.username" disabled />
      </a-form-item>
      <a-form-item label="角色" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-input :value="fotmatUserType" disabled />
      </a-form-item>
      <a-form-item label="Phone" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-input
          placeholder="Phone"
          v-decorator="['phone', { initialValue:user.phone,rules: [{ required: true, message: 'Please input your Phone!' }] },]"
        />
      </a-form-item>
      <!-- <a-form-item label="简介" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-textarea
          v-decorator="[
          'introduction',
          { initialValue:user.introduction },
        ]"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>-->
      <a-form-item label="公司名称" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-input
          placeholder="companyName"
          v-decorator="['companyName', { initialValue:user.companyName, rules: [{ required: true, message: 'Please input your company name!' }] },]"
        />
      </a-form-item>
      <a-form-item label="公司简介" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-textarea
          v-decorator="[
          'companyDesc',
          { initialValue:user.companyDesc }
        ]"
          placeholder="company description"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>
      <a-form-item label="注册时间" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-input :value="user.createTime" disabled />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">更新信息</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import * as userApi from "../../api/recruiterUser";
import { fotmatUserType } from "../../util/appUtil";

export default {
  data() {
    return {
      userForm: this.$form.createForm(this),
      user: {}
    };
  },
  mounted() {
    userApi.info.r().then(resp => {
      if (resp.data.code === "000000") {
        this.user = resp.data.data;
      }
    });
  },
  computed: {
    fotmatUserType() {
      return fotmatUserType(this.user.userType);
    }
  },
  methods: {
    handleUpdate(e) {
      e.preventDefault();
      this.userForm.validateFields((err, values) => {
        if (!err) {
          let updateVo = {
            phone: values.phone,
            introduction: values.introduction,
            companyName: values.companyName,
            companyDesc: values.companyDesc
          };
          userApi.updateUser.r(updateVo).then(resp => {
            if (resp.data.code === "000000") {
              this.$message.info("更新成功!");
            }
          });
        }
      });
    }
  }
};
</script>