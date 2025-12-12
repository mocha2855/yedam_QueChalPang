<template>
  <div class="container">
    <template v-if="commentList.length > 0">
      <p>댓글 목록</p>
      <hr />
      <table class="table table-hover">
        <tbody>
          <tr v-for="commentInfo of commentList" v-bind:key="commentInfo.no">
            <td>{{ commentInfo.content }}</td>
            <td>{{ commentInfo.writer }}</td>
            <td>{{ dateFormat(commentInfo.created_dt, "yyyy-MM-dd") }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <p v-else>댓글 없음</p>
  </div>
</template>

<script setup>
import dateFormat from "@/utils/dateFormat";
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
let commentList = ref({});

axios //
  .get("/api/board/" + route.params.id)
  .then((result) => {
    console.log(result.data);
    commentList.value = result.data;
  });
</script>
