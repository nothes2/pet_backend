<template>
  <el-row :gutter="16">
    <el-col :md="12" :span="24">
      <el-card shadow="hover" class="ops-card">
        <div class="card-header">
          <div>
            <div class="card-title">今日待诊</div>
            <div class="card-sub">待确认或待接诊的预约</div>
          </div>
          <el-tag type="warning" effect="light">共 {{ pendingList.length }} 条</el-tag>
        </div>
        <el-skeleton :loading="loading" animated :count="3">
          <template #template>
            <el-skeleton-item variant="text" style="width: 60%" />
            <el-skeleton-item variant="text" style="width: 40%" />
          </template>
          <template #default>
            <el-empty v-if="!pendingList.length" description="今日暂无待诊" />
            <el-table
              v-else
              :data="pendingList"
              size="small"
              border
              style="width: 100%"
            >
              <el-table-column prop="petName" label="宠物" width="120" />
              <el-table-column prop="appointmentType" label="类型" />
              <el-table-column prop="appointmentTime" label="时间" width="120">
                <template #default="scope">
                  {{ scope.row.appointmentTime || scope.row.timeSlot || scope.row.time || '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                  <el-tag :type="statusType(scope.row.status)">
                    {{ statusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-skeleton>
      </el-card>
    </el-col>
    <el-col :md="12" :span="24">
      <el-card shadow="hover" class="ops-card">
        <div class="card-header">
          <div>
            <div class="card-title">现场接诊</div>
            <div class="card-sub">已确认、正在接诊的预约</div>
          </div>
        <el-tag type="success" effect="light">共 {{ confirmedList.length }} 条</el-tag>
        </div>
        <el-skeleton :loading="loading" animated :count="3">
          <template #template>
            <el-skeleton-item variant="text" style="width: 60%" />
            <el-skeleton-item variant="text" style="width: 40%" />
          </template>
          <template #default>
            <el-empty v-if="!confirmedList.length" description="暂无现场接诊" />
            <el-table
              v-else
              :data="confirmedList"
              size="small"
              border
              style="width: 100%"
            >
              <el-table-column prop="petName" label="宠物" width="120" />
              <el-table-column prop="appointmentType" label="类型" />
              <el-table-column prop="appointmentTime" label="时间" width="120">
                <template #default="scope">
                  {{ scope.row.appointmentTime || scope.row.timeSlot || scope.row.time || '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                  <el-tag :type="statusType(scope.row.status)">
                    {{ statusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-skeleton>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
const props = defineProps({
  pendingList: { type: Array, default: () => [] },
  confirmedList: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  statusType: { type: Function, default: () => () => 'info' },
  statusText: { type: Function, default: () => (val) => val || '' }
})

const { pendingList, confirmedList, loading, statusType, statusText } = props
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  gap: 12px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--border);
  padding-bottom: 10px;
}

.ops-card {
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
  border: none;
  background: transparent;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-1);
}

.card-sub {
  font-size: 13px;
  color: var(--text-3);
  margin-top: 2px;
}

:deep(.el-table) {
  --el-table-border-color: var(--border);
}

:deep(.el-table th.el-table__cell) {
  background: var(--surface-2);
  color: var(--text-2);
}

:deep(.el-table--border::after),
:deep(.el-table::before) {
  background: var(--border);
}
</style>
