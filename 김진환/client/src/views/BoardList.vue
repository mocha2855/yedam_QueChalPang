<template>
  <div class="container">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>No.</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일자</th>
          <th>댓글 수</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="posts.length > 0">
          <tr v-for="post of posts" v-bind:key="post.no" @click="goToBoardInfo(post.no)">
            <td>{{ post.no }}</td>
            <td>{{ post.title }}</td>
            <td>{{ post.writer }}</td>
            <td>{{ dateFormat(post.created_dt, "yyyy-MM-dd") }}</td>
            <td>{{ post.comments }}</td>
          </tr>
        </template>
        <tr v-else>
          <td>표시할 내용 없음</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import dateFormat from "@/utils/dateFormat";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

let posts = ref([]);

onMounted(() => {
  axios //
    .get(`/api/boards`)
    .then((result) => {
      console.log(result.data);
      posts.value = result.data;
    });
});

const goToBoardInfo = (id) => {
  router.push({ name: "boardInfo", params: { id: id } });
};
</script>
