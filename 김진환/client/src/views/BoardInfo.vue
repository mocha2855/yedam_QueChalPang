<template>
  <div class="container">
    <table class="table">
      <tbody>
        <tr>
          <th class="text-right">번호</th>
          <td class="text-center">{{ posts.no }}</td>
        </tr>
        <tr>
          <th class="text-right">작성일</th>
          <td class="text-center">{{ dateFormat(posts.created_dt, "yyyy-MM-dd") }}</td>
        </tr>
        <tr>
          <th class="text-right">제목</th>
          <td class="text-center">{{ posts.title }}</td>
        </tr>
        <tr>
          <th class="text-right">이름</th>
          <td class="text-center">{{ posts.writer }}</td>
        </tr>
        <tr>
          <th class="text-right">내용</th>
          <td class="text-center">{{ posts.content }}</td>
        </tr>
      </tbody>
    </table>
    <div>
      <button class="btn btn-primary" @click="goToboardUpdate">수정</button>
    </div>
    <hr />
  </div>
  <CommentComponent />
</template>

<script setup>
import dateFormat from "@/utils/dateFormat";
import CommentComponent from "../components/CommentComponent.vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";

const route = useRoute();
const router = useRouter();

let posts = ref();
axios //
  .get("/api/boards/" + route.params.id)
  .then((result) => {
    posts.value = result.data;
  });

let id = route.params.id;
console.log(id);
const goToboardUpdate = () => {
  router.push({ name: "boardUpdate", params: { id: id } });
};
</script>
