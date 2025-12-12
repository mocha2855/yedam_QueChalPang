<template>
  <BoardForm>
    <template v-slot:no>
      <input class="form-control" type="text" v-model="boardInfo.no" readonly />
    </template>
    <template v-slot:title>
      <input class="form-control" type="text" v-model="boardInfo.title" />
    </template>
    <template v-slot:writer>
      <input class="form-control" type="text" v-model="boardInfo.writer" />
    </template>
    <template v-slot:content>
      <textarea class="form-control" v-model="boardInfo.content"></textarea>
    </template>
    <template v-slot:created_date>
      <input class="form-control" type="date" v-model="date" readonly />
    </template>
    <template v-slot:button>
      <button class="btn btn-info" @click="addBoard">저장</button>
    </template>
  </BoardForm>
</template>

<script setup>
import dateFormat from "@/utils/dateFormat";
import BoardForm from "@/components/BoardForm.vue";
import { reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

let date = dateFormat(new Date(), "yyyy-MM-dd");
console.log(date);

const boardInfo = reactive({ title: "", content: "", writer: "" });

const addBoard = async () => {
  if (!boardInfo.title || !boardInfo.content || !boardInfo.writer) {
    alert("값을 입력해주세요.");
    return;
  }

  await axios //
    .post(`/api/boards`, boardInfo)
    .then((result) => {
      router.push({ path: "/boardInfo/" + result });
    });
};
</script>
