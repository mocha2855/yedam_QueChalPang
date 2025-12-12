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
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

console.log(route.params.id);

let date = dateFormat(new Date(), "yyyy-MM-dd");
console.log(date);

let boardInfo = ref();

axios //
  .get("/api/boards/" + route.params.id)
  .then((result) => {
    console.log(result.data);
    boardInfo.value = result.data;
  });

const addBoard = () => {
  if (!boardInfo.value.title || !boardInfo.value.content || !boardInfo.value.writer) {
    alert("값을 입력해주세요.");
    return;
  }

  let board_id = route.params.id;

  axios //
    .put(`/api/boards/${board_id}`, boardInfo)
    .then((result) => {
      alert("수정완료");
      router.push({ path: "/boardInfo/" + result });
    });
};
</script>
