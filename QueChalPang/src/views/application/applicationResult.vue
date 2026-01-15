<template>
  <div>
    <div v-if="memAuthority == 'a2'">
      <div>
        <h5 style="float: left">지원결과 입력하기</h5>

        <button type="button" class="btn btn-primary btn-sm" @click="addResultForm">
          결과추가
        </button>
        <ApplicationModal v-if="selectPlan && !selectPlanCheck">
          <template v-slot:header><h2></h2></template>
          <template v-slot:body>
            <h4 style="text-align: center">결과서를 작성할<br />지원계획서를선택해주세요</h4>
            <div class="d-flex justify-content-center">
              <select
                class="btn btn-light"
                v-model="resultList"
                style="
                  text-align: center;
                  font-weight: bold;
                  font-size: large;
                  width: 200px;
                  height: 50px;
                "
                v-on:change="selectPlanList"
              >
                <option
                  class="dropdown-item"
                  v-for="(plan, index) in application.planningSuccess"
                  :value="plan"
                  v-bind:key="index"
                  style="color: #000; text-align: center"
                >
                  지원계획서{{ plan.ranking }}
                </option>
              </select>
            </div>
          </template>
          <template v-slot:footer>
            <button class="btn-save" v-on:click="checkPlan">확인</button>
            <button class="btn-cancel" v-on:click="UnCheckPlan">취소</button>
          </template>
        </ApplicationModal>
        <ApplicationModal v-if="callFirstSave">
          <template v-slot:header><h2></h2></template>
          <template v-slot:body
            ><h4 style="text-align: center">
              작성하던 내용을<br />
              불러오시겠습니까?
            </h4></template
          >
          <template v-slot:footer>
            <button class="btn-save" v-on:click="callSaveInfo">확인</button>
            <button class="btn-cancel" v-on:click="closeCallSaveInfo">취소</button>
          </template>
        </ApplicationModal>
      </div>

      <div class="card mb-3">
        <div class="card-body" v-if="selectPlanCheck">
          <div :value="realCount">
            <div v-if="!checked">
              <div class="d-flex justify-content-between">
                <div>
                  <h5>지원결과{{ resultList.ranking }} 입력</h5>
                </div>
                <div style="float: right">
                  <button type="button" class="btn btn-primary btn-sm" @click="saveForm">
                    임시저장
                  </button>
                  <button type="button" @click="delForm" class="btn btn-danger btn-sm">삭제</button>
                </div>
              </div>

              <form name="planning">
                <div class="row g-3 mb-2 align-items-center">
                  <div class="col-2">
                    <label for="planningtime" class="col-form-label">지원기간</label>
                  </div>
                  <div class="col-3">
                    <input
                      type="text"
                      name="startDate"
                      id="startDate"
                      v-model="resultList.planning_start"
                      class="form-control"
                      disabled
                    />
                  </div>
                  <div class="col-3">
                    <input
                      type="text"
                      name="endDate"
                      id="endDate"
                      v-model="resultList.planning_end"
                      class="form-control"
                      disabled
                    />
                  </div>
                  <div class="col-2">
                    <label for="writer" class="col-form-label">작성자</label>
                  </div>
                  <div class="col-2">
                    <input
                      type="text"
                      name="writer"
                      id="writer"
                      v-model="memName"
                      class="form-control"
                      aria-describedby="passwordHelpInline"
                      disabled
                    />
                  </div>
                </div>

                <div class="row g-3 mb-2 align-items-center">
                  <div class="col-2">
                    <label for="title" class="col-form-label">제목</label>
                  </div>
                  <div class="col-10">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      v-model="formData.result_title"
                      class="form-control"
                      aria-describedby="passwordHelpInline"
                    />
                  </div>
                </div>
                <div class="row g-3 mb-2 align-items-center">
                  <div class="col-2">
                    <label for="content" class="col-form-label">내용</label>
                  </div>
                  <div class="col-10">
                    <textarea
                      name="content"
                      id="content"
                      v-model="formData.result_content"
                      class="form-control"
                      rows="8"
                    />
                  </div>
                </div>
                <div class="row g-3 mb-2 align-items-center">
                  <div class="col-2">
                    <label for="attachmentFile" class="col-form-label">첨부파일</label>
                  </div>
                  <div class="col-10">
                    <div v-if="application.resultfirstSave == ''" class="col-12">
                      <input type="file" class="form-control" multiple @change="getFile" />
                    </div>
                    <div
                      v-else-if="
                        application.resultfirstSave.length > 0 &&
                        application.resultfirstSave[0].attachment_no
                      "
                      class="card card-body p-2"
                    >
                      <div
                        v-for="file in application.resultfirstSave[0].fileList"
                        :key="file.attachment_no"
                        class="mb-1"
                      >
                        <a
                          href="#"
                          @click.prevent="downloadFile(file.attachment_no)"
                          class="text-decoration-none text-primary fw-bold"
                        >
                          💾 {{ file.attachment_orginal }}
                        </a>
                        <span class="text-muted ms-2" style="font-size: 0.8em">
                          ({{ (file.attachment_size / 1024).toFixed(1) }} KB)
                        </span>
                      </div>
                    </div>
                    <input
                      v-else-if="
                        application.resultfirstSave.length > 0 &&
                        application.resultfirstSave[0].attachment_no == null
                      "
                      type="text"
                      class="form-control"
                      value="첨부파일 없음"
                      readonly
                    />
                  </div>
                </div>
              </form>
              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-primary btn-sm" @click="submitResultInfo">
                  승인요청
                </button>
              </div>
            </div>
            <ApplicationModal v-if="checked">
              <template v-slot:header><h2></h2></template>
              <template v-slot:body
                ><h4 style="text-align: center">
                  지원결과서를<br />정말 승인요청하시겠습니까?
                </h4></template
              >
              <template v-slot:footer>
                <button class="btn-save" v-on:click="sucessResult">확인</button>
                <button class="btn-cancel" v-on:click="notChecked">취소</button>
              </template>
            </ApplicationModal>
            <!-- 담당자 지원결과서 임시저장 -->
            <!--임시저장 0111   -->
            <ApplicationModal v-if="saveChecked">
              <template v-slot:header><h2></h2></template>
              <template v-slot:body
                ><h4 style="text-align: center">
                  작성하던 내용을<br />정말 임시저장하시겠습니까?
                </h4></template
              >
              <template v-slot:footer>
                <button class="btn-save" v-on:click="saveSubmit">확인</button>
                <button class="btn-cancel" v-on:click="closeConfirm">취소</button>
              </template>
            </ApplicationModal>
          </div>
        </div>
      </div>

      <!-- 반려된 결과서 수정 -->
      <div
        class="card mb-3"
        v-if="
          memAuthority == 'a2' &&
          application.resultChanging.length > 0 &&
          application.resultChanging.result_approvedDate != ''
        "
      >
        <div v-if="!changingChecked">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div class="row row-cols-auto">
                <div class="col">
                  <h5 class="badge badge-sm bg-gradient-secondary" style="height: 20px">반려</h5>
                </div>
                <div class="col px-0">
                  <h5 class="mb-0">지원결과{{ application.resultChanging[0].ranking }}</h5>
                  <p>지원계획서{{ application.resultChanging[0].ranking }}에 대한 지원결과서</p>
                </div>
              </div>

              <div>
                <p>작성일: {{ application.resultChanging[0].result_date }}</p>
              </div>
            </div>

            <form action="#" name="planning">
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="planningtime" class="col-form-label">지원기간</label>
                </div>
                <div class="col-3">
                  <input
                    type="text"
                    name="startDate"
                    id="startDate"
                    v-model="application.resultChanging[0].planning_start"
                    class="form-control"
                    disabled
                  />
                </div>
                <div class="col-3">
                  <input
                    type="text"
                    name="endDate"
                    id="endDate"
                    v-model="application.resultChanging[0].planning_end"
                    class="form-control"
                    disabled
                  />
                </div>
                <div class="col-2">
                  <label for="writer" class="col-form-label">작성자</label>
                </div>
                <div class="col-2">
                  <input
                    type="text"
                    name="writer"
                    id="writer"
                    v-model="memName"
                    class="form-control"
                    disabled
                  />
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="title" class="col-form-label">결과</label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    v-model="application.resultChanging[0].result_title"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="content" class="col-form-label">내용</label>
                </div>
                <div class="col-10">
                  <textarea
                    name="content"
                    id="content"
                    v-model="application.resultChanging[0].result_content"
                    class="form-control"
                    rows="8"
                  />
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="attachmentFile" class="col-form-label">첨부파일</label>
                </div>
                <div class="col-10">
                  <div
                    v-if="
                      application.resultChanging[0].fileList &&
                      application.resultChanging[0].fileList.length > 0
                    "
                    class="card card-body p-2"
                  >
                    <div
                      v-for="file in application.resultChanging[0].fileList"
                      :key="file.attachment_no"
                      class="mb-1"
                    >
                      <a
                        href="#"
                        @click.prevent="application.downloadFile(file.attachment_no)"
                        class="text-decoration-none text-primary fw-bold"
                      >
                        💾 {{ file.attachment_orginal }}
                      </a>
                      <span class="text-muted ms-2" style="font-size: 0.8em">
                        ({{ (file.attachment_size / 1024).toFixed(1) }} KB)
                      </span>
                    </div>
                  </div>
                  <input v-else type="text" class="form-control" value="첨부파일 없음" readonly />
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <div class="row g-3 mb-2 align-items-center">
                  <div class="col-6">
                    <label for="planningtime" class="col-form-label">결재자</label>
                  </div>
                  <div class="col-5">
                    <input
                      type="text"
                      name="startDate"
                      id="startDate"
                      v-model="application.resultChanging[0].planning_rejecter"
                      class="form-control"
                      readonly
                    />
                  </div>
                </div>
                <div class="row g-3 mb-2 align-items-center">
                  <div class="col-5">
                    <label for="writer" class="col-form-label">반려일</label>
                  </div>
                  <div class="col-7">
                    <input
                      type="text"
                      name="writer"
                      id="writer"
                      class="form-control"
                      v-model="application.resultChanging[0].result_reject_date"
                      readonly
                    />
                  </div>
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="rejectReason" class="col-form-label">반려사유</label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    name="rejectReason"
                    id="rejectReason"
                    v-model="application.resultChanging[0].result_reject"
                    class="form-control"
                    readonly
                  />
                </div>
              </div>
            </form>

            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-primary btn-sm" @click="modalOpen">
                승인요청
              </button>
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="cancelResultnfo(application.resultChanging[0].result_no)"
              >
                취소
              </button>
            </div>
          </div>
        </div>
        <ApplicationModal v-if="changingChecked">
          <template v-slot:header><h2></h2></template>
          <template v-slot:body
            ><h4 style="text-align: center">
              지원결과서를<br />
              승인요청하시겠습니까?
            </h4></template
          >
          <template v-slot:footer>
            <button
              class="btn-save"
              v-on:click="submitChaingResultInfo(application.resultChanging[0].result_no)"
            >
              확인
            </button>
            <button class="btn-cancel" v-on:click="notChecked">취소</button>
          </template>
        </ApplicationModal>
      </div>
    </div>

    <div style="height: 100%" v-else-if="memAuthority == 'a3'">
      <h5>지원결과 승인대기</h5>
    </div>

    <!-- 반려 검토중 -->
    <div class="card mb-3" v-for="plan in application.resultChangingReview" :key="plan.result_no">
      <div class="card-body" v-if="application.resultChangingReview.length > 0">
        <div v-if="!plan.checked && !plan.rejectChecked">
          <div class="d-flex justify-content-between">
            <div class="row row-cols-auto">
              <div class="col">
                <h5 class="badge badge-sm bg-gradient-secondary" style="height: 20px">반려</h5>
              </div>
              <div class="col px-0">
                <h5 class="mb-0">지원결과{{ plan.ranking }}</h5>
                <p>지원계획서{{ plan.ranking }}에 대한 지원결과서</p>
              </div>
            </div>

            <div>
              <p>작성일: {{ plan.result_date }}</p>
            </div>
          </div>

          <form action="#" name="planning">
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2">
                <label for="planningtime" class="col-form-label">지원기간</label>
              </div>
              <div class="col-3">
                <input
                  type="text"
                  name="startDate"
                  id="startDate"
                  v-model="plan.planning_start"
                  class="form-control"
                  readonly
                />
              </div>
              <div class="col-3">
                <input
                  type="text"
                  name="endDate"
                  id="endDate"
                  v-model="plan.planning_end"
                  class="form-control"
                  readonly
                />
              </div>
              <div class="col-2">
                <label for="writer" class="col-form-label">작성자</label>
              </div>
              <div class="col-2">
                <input
                  type="text"
                  name="writer"
                  id="writer"
                  v-model="plan.manager_name"
                  class="form-control"
                  readonly
                />
              </div>
            </div>
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2">
                <label for="title" class="col-form-label">결과제목</label>
              </div>
              <div class="col-10">
                <input
                  type="text"
                  name="title"
                  id="title"
                  v-model="plan.result_title"
                  class="form-control"
                  readonly
                />
              </div>
            </div>
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2">
                <label for="content" class="col-form-label">내용</label>
              </div>
              <div class="col-10">
                <textarea
                  name="content"
                  id="content"
                  v-model="plan.result_content"
                  class="form-control"
                  rows="8"
                  readonly
                />
              </div>
            </div>
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2">
                <label for="attachmentFile" class="col-form-label">첨부파일</label>
              </div>
              <div class="col-10">
                <div v-if="plan.fileList && plan.fileList.length > 0" class="card card-body p-2">
                  <div v-for="file in plan.fileList" :key="file.attachment_no" class="mb-1">
                    <a
                      href="#"
                      @click.prevent="downloadFile(file.attachment_no)"
                      class="text-decoration-none text-primary fw-bold"
                    >
                      💾 {{ file.attachment_orginal }}
                    </a>
                    <span class="text-muted ms-2" style="font-size: 0.8em">
                      ({{ (file.attachment_size / 1024).toFixed(1) }} KB)
                    </span>
                  </div>
                </div>

                <input v-else type="text" class="form-control" value="첨부파일 없음" readonly />
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-7">
                  <label for="planningtime" class="col-form-label">결재자</label>
                </div>
                <div class="col-5">
                  <input
                    type="text"
                    name="startDate"
                    id="startDate"
                    v-model="plan.rejecter_name"
                    class="form-control"
                    readonly
                  />
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-5">
                  <label for="writer" class="col-form-label">반려일</label>
                </div>
                <div class="col-7">
                  <input
                    type="text"
                    name="writer"
                    id="writer"
                    class="form-control"
                    v-model="plan.result_reject_date"
                    readonly
                  />
                </div>
              </div>
            </div>
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2">
                <label for="rejectReason" class="col-form-label">반려사유</label>
              </div>
              <div class="col-10">
                <input
                  type="text"
                  name="rejectReason"
                  id="rejectReason"
                  v-model="plan.result_reject"
                  class="form-control"
                  readonly
                />
              </div>
            </div>
          </form>

          <div class="d-flex justify-content-end" v-if="memAuthority == 'a3'">
            <button type="button" class="btn btn-primary btn-sm" @click="modalOpen(plan.result_no)">
              승인
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="modalClose(plan.result_no)"
            >
              반려
            </button>
          </div>
        </div>

        <!-- 관리자가 결과서 승인 -->
        <ApplicationModal v-if="plan.checked">
          <template v-slot:header><h2>지원결과서 승인</h2></template>
          <template v-slot:body
            ><h4 style="text-align: center" :value="plan.ranking">
              지원결과서{{ plan.ranking }}를<br />
              승인하시겠습니까?
            </h4></template
          >
          <template v-slot:footer>
            <button class="btn-save" v-on:click="sucessResult(plan.result_no)">확인</button>
            <button class="btn-cancel" v-on:click="notChecked(plan.result_no)">취소</button>
          </template>
        </ApplicationModal>

        <ApplicationModal v-if="plan.rejectChecked">
          <template v-slot:header><h2>지원결과서 반려</h2></template>
          <template #body>
            <p class="modal-text" style="text-align: center">
              지원결과서 {{ plan.ranking }}를<br />
              반려하시겠습니까?
            </p>

            <textarea
              v-model="modal.rejectReason"
              class="reason-input"
              placeholder="반려 사유를 입력해주세요."
            />
          </template>
          <template v-slot:footer>
            <button class="btn-save" v-on:click="rejectResult(plan.result_no)">반려</button>
            <button class="btn-cancel" v-on:click="notChecked(plan.result_no)">취소</button>
          </template>
        </ApplicationModal>
      </div>
    </div>

    <!--  검토중 결과서 -->
    <div
      v-if="application.resultReview.length > 0 && application.resultReview.result_reject == null"
    >
      <div class="card mb-3" v-for="plan in application.resultReview" :key="plan">
        <div class="card-body">
          <div v-if="!plan.checked && !plan.rejectChecked">
            <div class="formTop">
              <div v-if="memAuthority == 'a2'" class="row row-cols-auto">
                <div class="col">
                  <h5 class="badge badge-sm bg-gradient-secondary" style="height: 20px">검토중</h5>
                </div>
                <div class="col px-0">
                  <h5 class="mb-0">지원결과{{ plan.ranking }}</h5>
                  <p>지원계획서{{ plan.ranking }}에 대한 지원결과서</p>
                </div>
              </div>

              <!-- 관리자가 보는. 검토중인 결과서 => 여기서 승인반려 -->
              <div v-if="memAuthority == 'a3'" class="row row-cols-1">
                <div class="col">
                  <h5 class="mb-0">지원결과{{ plan.ranking }}</h5>
                </div>
                <div class="col">
                  <p>지원계획서{{ plan.ranking }}에 대한 지원결과서</p>
                </div>
              </div>
            </div>
            <form action="#" name="planning">
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="planningtime" class="col-form-label">지원기간</label>
                </div>
                <div class="col-3">
                  <input
                    type="text"
                    name="startDate"
                    id="startDate"
                    v-model="plan.planning_start"
                    class="form-control"
                    readonly
                  />
                </div>
                <div class="col-3">
                  <input
                    type="text"
                    name="endDate"
                    id="endDate"
                    v-model="plan.planning_end"
                    class="form-control"
                    readonly
                  />
                </div>
                <div class="col-2">
                  <label for="writer" class="col-form-label">작성자</label>
                </div>
                <div class="col-2">
                  <input
                    type="text"
                    name="writer"
                    id="writer"
                    v-model="application.dependantRealInfo.manager_name"
                    class="form-control"
                    readonly
                  />
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="title" class="col-form-label">제목</label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    v-model="plan.result_title"
                    class="form-control"
                    readonly
                  />
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="content" class="col-form-label">내용</label>
                </div>
                <div class="col-10">
                  <textarea
                    name="content"
                    id="content"
                    v-model="plan.result_content"
                    class="form-control"
                    rows="8"
                    readonly
                  />
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="attachmentFile" class="col-form-label">첨부파일</label>
                </div>
                <div class="col-10">
                  <div v-if="plan.fileList && plan.fileList.length > 0" class="card card-body p-2">
                    <div v-for="file in plan.fileList" :key="file.attachment_no" class="mb-1">
                      <a
                        href="#"
                        @click.prevent="downloadFile(file.attachment_no)"
                        class="text-decoration-none text-primary fw-bold"
                      >
                        💾 {{ file.attachment_orginal }}
                      </a>
                      <span class="text-muted ms-2" style="font-size: 0.8em">
                        ({{ (file.attachment_size / 1024).toFixed(1) }} KB)
                      </span>
                    </div>
                  </div>
                  <input v-else type="text" class="form-control" value="첨부파일 없음" readonly />
                </div>
              </div>
            </form>

            <div class="d-flex justify-content-end" v-if="memAuthority == 'a3'">
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="modalOpen(plan.result_no)"
              >
                승인
              </button>
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="modalClose(plan.result_no)"
              >
                반려
              </button>
            </div>
          </div>

          <!-- 관리자가 지원계획서 승인하기 -->
          <ApplicationModal v-if="plan.checked">
            <template v-slot:header><h2>지원결과서 승인</h2></template>
            <template v-slot:body
              ><h4 style="text-align: center" :value="plan.ranking">
                지원결과서{{ plan.ranking }}를<br />
                승인하시겠습니까?
              </h4></template
            >
            <template v-slot:footer>
              <button class="btn-save" v-on:click="sucessResult(plan.result_no)">확인</button>
              <button class="btn-cancel" v-on:click="notChecked(plan.result_no)">취소</button>
            </template>
          </ApplicationModal>

          <!-- 관리자가 지원계획서 반려하기 -->
          <ApplicationModal v-if="plan.rejectChecked">
            <template v-slot:header><h2>지원결과서 반려</h2></template>
            <template #body>
              <p class="modal-text" style="text-align: center">
                지원결과서 {{ plan.ranking }}를<br />
                반려하시겠습니까?
              </p>

              <textarea
                v-model="modal.rejectReason"
                class="reason-input"
                placeholder="반려 사유를 입력해주세요."
              />
            </template>
            <template v-slot:footer>
              <button class="btn-save" v-on:click="rejectResult(plan.result_no)">반려</button>
              <button class="btn-cancel" v-on:click="notChecked(plan.result_no)">취소</button>
            </template>
          </ApplicationModal>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useCounterStore } from '@/stores/member'
import { useApplicationStore } from '@/stores/application'
import axios from 'axios'
import { useModalStore } from '@/stores/modal'
import ApplicationModal from './modals/ApplicationModal.vue'
import Swal from 'sweetalert2'

const route = useRoute()
const modal = useModalStore()

const counters = useCounterStore()
const application = useApplicationStore()
// 권한 및 담당 지원자 일치 확인
let memAuthority = counters.isLogIn.info.member_authority // 권한
let memName = counters.isLogIn.info.member_name // 작성자
let realCount = ref(0) // 지원계획서 진짜 갯수

// 계획서 선택 드롭다운
let resultList = ref()
const selectPlanList = () => {
  console.log(resultList.value)
}

onBeforeMount(async () => {
  // 계획서 갯수 파악
  await application.countRealResult(route.params.id)
  // 1. 검토중 리스트 파일 로드
  await fetchFilesForPlans(application.resultReview)
  console.log(application.resultReview[0])

  // 2. 반려 검토중 리스트 파일 로드
  await fetchFilesForPlans(application.resultChangingReview)

  // 3. 반려 후 수정 리스트 파일 로드
  await fetchFilesForPlans(application.resultChanging)

  // 4. 임시 저장 리스트 파일 로드
  await fetchFilesForPlans(application.resultfirstSave)
  await fetchFilesForPlans(application.resultSuccess)
  await fetchFilesForPlans(application.resultRejected)

  addCount.value = application.planned
  console.log('addCount: ', addCount.value)
  if (addCount.value != 0) {
    realCount.value = addCount.value + 1
    addCount.value = 0
  } else {
    realCount.value = 1
  }
  console.log(`realCount.value: ${realCount.value}`)
  console.log(`addCount.value: ${addCount.value}`)
})

// 계획선택 모달창 확인버튼
let selectPlanCheck = ref(false)
const checkPlan = async () => {
  if (resultList.value == undefined) {
    await Swal.fire({
      icon: 'warning',
      text: '계획서 선택을 완료해주세요.',
      confirmButtonText: '확인',
    })

    return
  }
  selectPlanCheck.value = !selectPlanCheck.value
}

// 계획선택 모달창 취소버튼
const UnCheckPlan = () => {
  selectPlan.value = !selectPlan.value
  resultList.value = undefined
  if (addCount.value == 1) {
    addCount.value = 0
    formData.value = {}
    application.planningState = 0
  }
}

// 결과 추가 버튼
let addCount = ref(0) // 계획추가 버튼용
let selectPlan = ref(false)

const addResultForm = async () => {
  if (application.resultfirstSave.length > 0) {
    callFirstSave.value = true
    application.planningState = 1
    return
  }
  if (application.resultChanging.length > 0) {
    await Swal.fire({
      icon: 'warning',
      text: '수정하던 작업을 마무리해주세요.',
      confirmButtonText: '확인',
    })
    return
  }
  selectPlan.value = true
  if (addCount.value == 0) {
    addCount.value = 1
    application.planningState = 1
    count.value = 0

    return
  }
  if (application.dependantInfo.status_status != 'i2') {
    await Swal.fire({
      icon: 'warning',
      text: '대기단계 선택을 먼저 완료해주세요',
      confirmButtonText: '확인',
    })
    return
  }

  if (count.value != 1) {
    await Swal.fire({
      icon: 'warning',
      text: '작성하던 내용을 완료해주세요.',
      confirmButtonText: '확인',
    })
  }

  application.planningState = 1
}

// 삭제 버튼
const delForm = () => {
  selectPlan.value = false
  selectPlanCheck.value = false
  resultList.value = undefined

  if (addCount.value == 1) {
    addCount.value = 0
    formData.value = {}
    application.planningState = 0
    count.value = 1
  }
}

// 승인요청 버튼(담당자)
let formData = ref({})
let count = ref(0) // 승인요청 횟수
let checked = ref(false)

const submitResultInfo = async () => {
  if (
    formData.value.result_title == undefined ||
    formData.value.result_content == undefined ||
    formData.value.result_title == '' ||
    formData.value.result_content == ''
  ) {
    await Swal.fire({
      icon: 'warning',
      text: '내용 입력을 완료해주세요',
      confirmButtonText: '확인',
    })

    return
  }
  console.log('?: ', formData.value)
  count.value++
  checked.value = true
}

// 승인버튼
let changingChecked = ref(false)

const modalOpen = async (data) => {
  console.log(data)
  // 검토중
  if (memAuthority == 'a3') {
    if (application.planningState == 3) {
      await Swal.fire({
        icon: 'warning',
        text: '먼저 작업 중인 것을 완료해주세요.',
        confirmButtonText: '확인',
      })

      return
    }
    application.resultReview.forEach((review) => {
      if (data == review.result_no) {
        review.checked = !review.checked
        review.rejectChecked = false
        application.planningState = 3
        return
      }
    })
    // 반려중
    application.resultChangingReview.forEach((review) => {
      if (data == review.result_no) {
        review.checked = !review.checked
        review.rejectChecked = false
        application.planningState = 3

        return
      }
    })
  }
  // 반려후 승인요청버튼(담당자)
  if (memAuthority == 'a2' && application.resultChanging != '') {
    console.log('application.resultChanging: ', application.resultChanging[0])
    if (
      application.resultChanging[0].result_title == undefined ||
      application.resultChanging[0].result_content == undefined ||
      application.resultChanging[0].result_title == '' ||
      application.resultChanging[0].result_content == ''
    ) {
      await Swal.fire({
        icon: 'warning',
        text: '내용 입력을 완료해주세요.',
        confirmButtonText: '확인',
      })

      return
    }
    changingChecked.value = true
    return
  }
}

// 승인모달창-확인버튼
const sucessResult = async (data) => {
  console.log(data)

  // 담당자

  if (memAuthority == 'a2') {
    if (application.resultfirstSave.length > 0) {
      if (application.resultfirstSave.length > 0) {
        await axios
          .put('/api/saveResultOneMOre/' + application.resultfirstSave[0].planning_no, {
            planning_id: counters.isLogIn.info.member_id,
            planning_rejecter: application.dependantInfo.application_rejector,
            planning_start: resultList.value.planning_start,
            planning_end: resultList.value.planning_end,
            result_title: formData.value.result_title,
            result_content: formData.value.result_content,
            result_status: 'i1',
          })
          .then((res) => {
            console.log(res)
            Swal.fire({
              icon: 'success',
              text: '승인요청 완료.',
              confirmButtonText: '확인',
            })
            application.planningState = 0

            saveChecked.value = false

            checked.value = false
            selectPlanCheck.value = false
            selectPlan.value = false

            addCount.value = 0
            formData.value = {}
            attachmentFiles.value = []
            resultList.value = {}
            count.value = 1
          })
        await application.countRealResult(route.params.id)
        await fetchFilesForPlans(application.resultReview)
        await fetchFilesForPlans(application.resultSuccess)
        await fetchFilesForPlans(application.resultRejected)
        await fetchFilesForPlans(application.resultChanging)
        await fetchFilesForPlans(application.resultChangingReview)
      }
      return
    } else {
      const finalForm = new FormData()
      finalForm.append('planning_id', application.dependantInfo.manager_id)
      finalForm.append('planning_rejecter', application.dependantInfo.application_rejector)
      finalForm.append('planning_start', resultList.value.planning_start)
      finalForm.append('planning_end', resultList.value.planning_end)
      finalForm.append('result_title', formData.value.result_title)
      finalForm.append('result_content', formData.value.result_content)
      // 파일 데이터 (배열 반복)
      console.log('finalForm: ', finalForm)
      if (attachmentFiles.value.length > 0) {
        attachmentFiles.value.forEach((file) => {
          finalForm.append('files', file)
        })
      }
      await axios //
        .post('/api/submitResultInfo/' + resultList.value.planning_no, finalForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          console.log(res)
          Swal.fire({
            icon: 'success',
            text: '승인요청 완료.',
            confirmButtonText: '확인',
          })
          application.planningState = 0

          checked.value = false
          selectPlanCheck.value = false
          selectPlan.value = false

          addCount.value = 0
          formData.value = {}
          attachmentFiles.value = []
          resultList.value = {}
          count.value = 1
        })

      await application.countRealResult(route.params.id)
      await fetchFilesForPlans(application.resultReview)
      await fetchFilesForPlans(application.resultSuccess)
      await fetchFilesForPlans(application.resultRejected)
      await fetchFilesForPlans(application.resultChanging)
      await fetchFilesForPlans(application.resultChangingReview)
      return
    }
  }
  // 관리자
  if (memAuthority == 'a3') {
    await axios //
      .put('/api/successResultInfo/' + data, {
        result_status: 'i2',
      })
      .then((res) => {
        console.log(res)
        Swal.fire({
          icon: 'success',
          text: '승인완료했습니다.',
          confirmButtonText: '확인',
        })
        application.planningState = 0
      })
    await application.countRealResult(route.params.id)
    await fetchFilesForPlans(application.resultReview)
    await fetchFilesForPlans(application.resultSuccess)
    await fetchFilesForPlans(application.resultRejected)
    await fetchFilesForPlans(application.resultChanging)
    await fetchFilesForPlans(application.resultChangingReview)
    return
  }
}

// 승인모달창-취소버튼
const notChecked = (data) => {
  if (memAuthority == 'a2') {
    checked.value = false
    changingChecked.value = false
  }
  if (memAuthority == 'a3') {
    application.resultReview.forEach((review) => {
      if (data == review.result_no) {
        review.checked = false
        review.rejectChecked = false
        modal.rejectReason = null
        application.planningState = 0
      }
    })
    application.resultChangingReview.forEach((review) => {
      if (data == review.result_no) {
        review.checked = false
        review.rejectChecked = false
        application.planningState = 0
      }
    })
  }
}

// 반려버튼
const modalClose = async (data) => {
  console.log(data)
  if (memAuthority == 'a3') {
    if (application.planningState == 3) {
      await Swal.fire({
        icon: 'warning',
        text: '작성하던 작업을 완료해주세요.',
        confirmButtonText: '확인',
      })

      return
    }
    application.resultReview.forEach((review) => {
      if (data == review.result_no) {
        review.checked = false
        review.rejectChecked = !review.rejectChecked
        console.log(review.planning_no, review.rejectChecked)
        application.planningState = 3
        return
      }
      // planningNo.value = data
    })
    application.resultChangingReview.forEach((review) => {
      if (data == review.result_no) {
        review.checked = false
        review.rejectChecked = !review.rejectChecked
        console.log(review.planning_no, review.rejectChecked)
        application.planningState = 3
      }
      // planningNo.value = data
    })
  }
}

// 반려모달창-확인버튼
const rejectResult = async (data) => {
  if (modal.rejectReason == undefined || modal.rejectReason == '') {
    await Swal.fire({
      icon: 'warning',
      text: '반려사유를 작성해주세요.',
      confirmButtonText: '확인',
    })
    return
  }
  await axios //
    .put('/api/rejectResultInfo/' + data, {
      result_status: 'i3',
      result_reject: modal.rejectReason,
    })
    .then((res) => {
      console.log(res)
      Swal.fire({
        icon: 'success',
        text: '반려했습니다.',
        confirmButtonText: '확인',
      })
      modal.rejectReason = undefined

      application.planningState = 0
    })
  await application.countRealResult(route.params.id)
  await fetchFilesForPlans(application.resultfirstSave)

  await fetchFilesForPlans(application.resultReview)
  await fetchFilesForPlans(application.resultSuccess)
  await fetchFilesForPlans(application.resultRejected)
  await fetchFilesForPlans(application.resultChanging)
  await fetchFilesForPlans(application.resultChangingReview)
  return
}

// 반려 후 수정 중 취소 버튼(담당자)
const cancelResultnfo = async (data) => {
  console.log(data)
  await axios
    .put('/api/successResultInfo/' + data, {
      result_status: 'i3',
    })
    .then(() => {
      application.resultChanging = []
    })
  await application.countRealResult(route.params.id)
  await fetchFilesForPlans(application.resultfirstSave)

  await fetchFilesForPlans(application.resultReview)
  await fetchFilesForPlans(application.resultSuccess)
  await fetchFilesForPlans(application.resultRejected)
  await fetchFilesForPlans(application.resultChanging)
  await fetchFilesForPlans(application.resultChangingReview)
  return
}

// 반려 후 승인요청 모달창 승인 버튼(담당자)
const submitChaingResultInfo = async (data) => {
  console.log(data)
  await axios //
    .put('/api/submitChangingResultInfo/' + data, {
      planning_id: application.resultChanging[0].planning_id,
      planning_rejecter: application.resultChanging[0].planning_rejecter,
      planning_start: application.resultChanging[0].planning_start,
      planning_end: application.resultChanging[0].planning_end,
      result_title: application.resultChanging[0].result_title,
      result_content: application.resultChanging[0].result_content,
      result_approvedDate: null,
    })
    .then((res) => {
      console.log(res)
      application.resultChanging = []

      changingChecked.value = false
      Swal.fire({
        icon: 'success',
        text: '승인요청 완료.',
        confirmButtonText: '확인',
      })
    })
  await application.countRealResult(route.params.id)
  await fetchFilesForPlans(application.resultfirstSave)

  await fetchFilesForPlans(application.resultReview)
  await fetchFilesForPlans(application.resultSuccess)
  await fetchFilesForPlans(application.resultRejected)
  await fetchFilesForPlans(application.resultChanging)
  await fetchFilesForPlans(application.resultChangingReview)
}

// 지원 결과서 임시저장 0111
let saveChecked = ref(false)
const saveForm = () => {
  saveChecked.value = true
}

const saveSubmit = async () => {
  if (application.resultfirstSave.length > 0) {
    await axios //
      .put('/api/saveResultOneMOre/' + application.resultfirstSave[0].planning_no, {
        planning_id: counters.isLogIn.info.member_id,
        planning_rejecter: application.dependantInfo.application_rejector,
        planning_start: resultList.value.planning_start,
        planning_end: resultList.value.planning_end,
        result_title: formData.value.result_title,
        result_content: formData.value.result_content,
      })
      .then((res) => {
        console.log(res)
        Swal.fire({
          icon: 'success',
          text: '임시저장 완료.',
          confirmButtonText: '확인',
        })

        saveChecked.value = false

        checked.value = false
        selectPlanCheck.value = false
        selectPlan.value = false

        addCount.value = 0
        formData.value = {}
        attachmentFiles.value = []
        resultList.value = {}
        count.value = 1
      })
    await application.countRealResult(route.params.id)
    await fetchFilesForPlans(application.resultfirstSave)
    await fetchFilesForPlans(application.resultReview)
    await fetchFilesForPlans(application.resultSuccess)
    await fetchFilesForPlans(application.resultRejected)
    await fetchFilesForPlans(application.resultChanging)
    await fetchFilesForPlans(application.resultChangingReview)

    return
  }

  const finalForm = new FormData()
  finalForm.append('planning_id', counters.isLogIn.info.member_id)
  finalForm.append('planning_rejecter', application.dependantInfo.application_rejector)
  finalForm.append('planning_start', resultList.value.planning_start)
  finalForm.append('planning_end', resultList.value.planning_end)
  if (formData.value.result_title) {
    finalForm.append('result_title', formData.value.result_title)
  }
  if (formData.value.result_content) {
    finalForm.append('result_content', formData.value.result_content)
  }
  console.log('finalForm: ', finalForm)
  // 파일 데이터 (배열 반복)
  if (attachmentFiles.value.length > 0) {
    attachmentFiles.value.forEach((file) => {
      finalForm.append('files', file)
    })
  }
  await axios //
    .post('/api/saveFirstResult/' + resultList.value.planning_no, finalForm, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      console.log(res)
      Swal.fire({
        icon: 'success',
        text: '임시저장 완료.',
        confirmButtonText: '확인',
      })

      saveChecked.value = false

      checked.value = false
      selectPlanCheck.value = false
      selectPlan.value = false

      addCount.value = 0
      formData.value = {}
      attachmentFiles.value = []
      resultList.value = {}
      count.value = 1
    })
  await application.countRealResult(route.params.id)
  await fetchFilesForPlans(application.resultReview)
  await fetchFilesForPlans(application.resultfirstSave)
  await fetchFilesForPlans(application.resultSuccess)
  await fetchFilesForPlans(application.resultRejected)
  await fetchFilesForPlans(application.resultChanging)
  await fetchFilesForPlans(application.resultChangingReview)
}

const closeConfirm = () => {
  saveChecked.value = false
}

const callFirstSave = ref(false)

const callSaveInfo = () => {
  callFirstSave.value = false
  selectPlanCheck.value = !selectPlanCheck.value
  resultList.value = application.resultfirstSave[0]
  formData.value = application.resultfirstSave[0]
}

const closeCallSaveInfo = async () => {
  await axios //
    .delete('/api/delResultFirstSave/' + application.resultfirstSave[0].planning_no)
    .then((res) => {
      console.log(res)
      console.log('??', application.resultfirstSave[0])

      if (application.resultfirstSave[0].attachment_no) {
        axios //
          .delete(`/api/delAttachment/` + application.resultfirstSave[0].attachment_no)
          .then((res) => {
            console.log(res)
          })
      }

      formData.value = {}
      attachmentFiles.value = []
      resultList.value = {}
      application.resultfirstSave = []

      callFirstSave.value = false
      selectPlan.value = true
      if (addCount.value == 0) {
        addCount.value = 1
        return
      }
    })
}

const attachmentFiles = ref([])
const getFile = (e) => {
  console.log(e.target.files)
  attachmentFiles.value = Array.from(e.target.files)
  console.log('선택된 파일들:', attachmentFiles.value)
}
// 다운로드
const downloadFile = (attachmentNo) => {
  // 백엔드 다운로드 API 주소를 호출하여 브라우저가 다운로드하게 함
  window.location.href = `/api/download/${attachmentNo}`
  // 포트번호(3000)나 도메인은 환경에 맞게 수정하세요.
  // 프록시가 설정되어 있다면 '/api/download/...' 만 써도 됩니다.
}
// 파일 목록을 가져와서 plan 객체 안에 심어주는 함수
const fetchFilesForPlans = async (plans) => {
  // 리스트가 비어있으면 종료
  if (!plans || plans.length === 0) return
  // 리스트 하나하나(plan)를 꺼내서 확인
  for (const plan of plans) {
    // 1. 그룹 ID가 있는지 확인 (파일이 있는 결과서인지)
    if (plan.attachment_no != '' || plan.attachment_no != null) {
      try {
        // 2. 백엔드에 파일 목록 요청
        const res = await axios.get(`/api/attachments/${plan.attachment_no}`)

        // 3. 가져온 파일 목록을 해당 plan 객체 안에 'fileList'라는 이름으로 심어줌
        // 이렇게 해야 템플릿(HTML)에서 v-for="file in plan.fileList"로 보여줄 수 있음
        plan.fileList = res.data
      } catch (err) {
        console.error(`파일 목록 조회 실패 (Group: ${plan.attachment_no})`, err)
      }
    }
  }
}
</script>
<style scoped>
.btn-save,
.btn-cancel {
  padding: 12px 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-save {
  background: #2196f3;
  color: white;
}

.btn-save:hover {
  background: #1976d2;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.btn-cancel {
  background: #f44336;
  color: white;
}

.btn-cancel:hover {
  background: #d32f2f;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}
.reason-input {
  width: 100%;
  min-height: 150px;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 15px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
</style>
