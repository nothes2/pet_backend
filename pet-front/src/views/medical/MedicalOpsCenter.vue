<template>
  <div class="ops-layout">
    <aside class="ops-sider">
      <div class="sider-brand" @click="router.push('/')">
        <div class="brand-logo">
          <img class="brand-logo-img" :src="brandLogo" alt="logo" />
        </div>
        <div class="brand-text">
          <div class="brand-title">毛孩子的星球</div>
          <div class="brand-sub">医疗操作中心</div>
        </div>
      </div>
      <div class="sider-title">医疗操作中心</div>
      <div class="sider-sub">为兽医准备的诊疗工作台</div>
      <div class="sider-menu-wrapper">
        <el-menu
          class="sider-menu"
          :default-active="activeMenu"
          @select="handleMenuSelect"
          background-color="transparent"
          text-color="#e5eaf5"
          active-text-color="#ffffff"
        >
          <el-menu-item
            v-for="item in menuItems"
            :key="item.key"
            :index="item.key"
          >
            <el-icon v-if="item.icon" class="menu-icon">
              <component :is="item.icon" />
            </el-icon>
            <div class="menu-text">
              <span class="menu-label">{{ item.label }}</span>
              <span class="menu-desc">{{ item.desc }}</span>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="account-block">
        <div class="account-label">当前账号</div>
        <div class="account-name">{{ veterinarianName }}</div>
      </div>
      <el-button class="back-home" type="primary" plain @click="handleLogout">
        退出登录
      </el-button>
    </aside>

    <div class="ops-main">
      <section v-if="activeMenu === 'overview'" class="section-block">
        <el-row :gutter="12" class="stat-row">
          <el-col :md="6" :span="12">
            <div class="stat-card">
              <div class="stat-label">待诊</div>
              <div class="stat-value">{{ workloadStats.pendingCount }}</div>
            </div>
          </el-col>
          <el-col :md="6" :span="12">
            <div class="stat-card">
              <div class="stat-label">已确认</div>
              <div class="stat-value">{{ workloadStats.confirmedCount }}</div>
            </div>
          </el-col>
          <el-col :md="6" :span="12">
            <div class="stat-card">
              <div class="stat-label">已完成</div>
              <div class="stat-value">{{ workloadStats.completedCount }}</div>
            </div>
          </el-col>
          <el-col :md="6" :span="12">
            <div class="stat-card">
              <div class="stat-label">已取消</div>
              <div class="stat-value">{{ workloadStats.cancelledCount }}</div>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="12" class="stat-row overview-row">
          <el-col :md="8" :span="24">
            <div class="stat-card stat-card-soft">
              <div class="stat-label">今日预约</div>
              <div class="stat-value">{{ overviewStats.today.appointments }}</div>
            </div>
          </el-col>
          <el-col :md="8" :span="24">
            <div class="stat-card stat-card-soft">
              <div class="stat-label">今日服务宠物</div>
              <div class="stat-value">{{ overviewStats.today.patients }}</div>
            </div>
          </el-col>
          <el-col :md="8" :span="24">
            <div class="stat-card stat-card-soft">
              <div class="stat-label">活跃用药方案</div>
              <div class="stat-value">{{ overviewStats.today.medications }}</div>
            </div>
          </el-col>
        </el-row>

        <div class="ops-hero">
          <div class="hero-text">
            <p class="eyebrow">Veterinary Workspace</p>
            <h1 class="hero-title">医疗操作中心</h1>
            <p class="hero-sub">
              你好，{{ veterinarianName }}，这里汇总了诊疗高频动作，便于快速进入预约、病历与提醒流。
            </p>
            <div class="hero-actions">
              <el-button type="primary" @click="goAppointments">预约面板</el-button>
              <el-button plain @click="goMedicalRecords">医疗记录</el-button>
            </div>
          </div>
          <div class="hero-meta">
            <el-tag type="primary" effect="dark">角色：兽医</el-tag>
          </div>
        </div>

        <el-card class="ops-card quick-card" shadow="hover">
          <div class="card-header">
            <div>
              <div class="card-title">快捷操作</div>
              <div class="card-sub">常用诊疗动作的入口</div>
            </div>
          </div>
          <el-row :gutter="12">
            <el-col
              v-for="item in quickActions"
              :key="item.title"
              :sm="12"
              :md="6"
              :span="6"
            >
              <div class="quick-item" @click="item.action()">
                <div class="quick-name">{{ item.title }}</div>
                <div class="quick-desc">{{ item.desc }}</div>
                <el-button :type="item.type || 'primary'" text size="small">立即前往</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </section>

      <section v-else-if="activeMenu === 'medications'" class="section-block">
        <el-card shadow="hover" class="ops-card">
          <div class="card-header">
            <div>
              <div class="card-title">用药记录</div>
              <div class="card-sub">由当前兽医开立/维护的用药方案</div>
            </div>
          </div>
          <el-skeleton :loading="medicationLoading" animated :count="3">
            <template #template>
              <el-skeleton-item variant="text" style="width: 60%" />
              <el-skeleton-item variant="text" style="width: 40%" />
            </template>
            <template #default>
              <el-empty v-if="!medicationRecords.length" description="暂无用药记录" />
              <el-table
                v-else
                :data="medicationRecords"
                size="small"
                border
                style="width: 100%"
              >
                <el-table-column prop="petName" label="宠物" width="120" />
                <el-table-column prop="drugName" label="药品" />
                <el-table-column prop="dosage" label="剂量" width="120" />
                <el-table-column prop="frequency" label="频次" width="120" />
                <el-table-column prop="startDate" label="开始日期" width="120" />
                <el-table-column prop="endDate" label="结束日期" width="120" />
                <el-table-column prop="status" label="状态" width="120" />
              </el-table>
            </template>
          </el-skeleton>
        </el-card>
      </section>

      <section v-else-if="activeMenu === 'treat'" class="section-block">
        <TreatWorkbench
          :pending-list="todayPending"
          :confirmed-list="todayConfirmed"
          :loading="appointmentLoading"
          :status-type="statusType"
          :status-text="statusText"
        />
      </section>

      <section v-else-if="activeMenu === 'appointments'" class="section-block">
        <AppointmentManager
          :appointments="vetAppointments"
          :loading="appointmentLoading"
          :pet-options="petOptions"
          :institution-name="institutionName"
          :appointment-type-options="scheduleSettings.allowedTypes"
          :default-appointment-type="defaultAppointmentType"
          :schedule-hint="scheduleHint"
          :status-type="statusType"
          :status-text="statusText"
          :on-create="handleCreateAppointment"
          :on-go-list="goAppointments"
          :on-confirm="handleConfirmAppointment"
          :on-cancel="handleCancelAppointment"
        />
      </section>

      <section v-else-if="activeMenu === 'records'" class="section-block">
        <el-card shadow="hover" class="ops-card">
          <div class="card-header">
            <div>
              <div class="card-title">诊疗记录</div>
              <div class="card-sub">最近病历与诊疗方案</div>
            </div>
            <div class="card-actions">
              <el-button text type="primary" @click="openMedicalTemplateDialog">模板录入</el-button>
              <el-button type="primary" @click="openCreateMedicalRecord()">新增诊疗记录</el-button>
              <el-button text type="primary" @click="loadMedicalRecords">刷新</el-button>
            </div>
          </div>
          <el-skeleton :loading="recordLoading" animated :count="3">
            <template #template>
              <el-skeleton-item variant="text" style="width: 50%" />
              <el-skeleton-item variant="text" style="width: 70%" />
            </template>
            <template #default>
              <el-empty v-if="!recentRecords.length" description="暂无医疗记录" />
              <el-table
                v-else
                :data="recentRecords"
                size="small"
                border
                style="width: 100%"
              >
                <el-table-column prop="petName" label="宠物" width="120" />
                <el-table-column prop="visitDate" label="就诊日期" width="130" />
                <el-table-column prop="reason" label="主诉" min-width="180" show-overflow-tooltip />
                <el-table-column prop="diagnosis" label="诊断" />
                <el-table-column prop="recordStatus" label="状态" width="100" />
                <el-table-column prop="followUpDate" label="复诊日期" width="130" />
                <el-table-column prop="vetName" label="医生" width="120">
                  <template #default="scope">
                    {{ scope.row.vetName || scope.row.vetUserId || '本账号' }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template #default="scope">
                    <el-button type="primary" text size="small" @click="openEditMedicalRecord(scope.row)">
                      编辑
                    </el-button>
                    <el-popconfirm
                      title="确认删除该诊疗记录？"
                      confirm-button-text="删除"
                      cancel-button-text="取消"
                      confirm-button-type="danger"
                      @confirm="handleDeleteMedicalRecord(scope.row)"
                    >
                      <template #reference>
                        <el-button type="danger" text size="small">删除</el-button>
                      </template>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-skeleton>
        </el-card>
      </section>

      <section v-else-if="activeMenu === 'reminders'" class="section-block">
        <el-card shadow="hover" class="ops-card">
          <div class="card-header">
            <div>
              <div class="card-title">随访与提醒</div>
              <div class="card-sub">复诊、用药、疫苗的跟进提醒</div>
            </div>
            <el-button text type="primary" @click="router.push('/reminders')">管理提醒</el-button>
          </div>
          <el-skeleton :loading="reminderLoading" animated :count="3">
            <template #template>
              <el-skeleton-item variant="text" style="width: 60%" />
              <el-skeleton-item variant="text" style="width: 40%" />
            </template>
            <template #default>
              <el-empty v-if="!reminders.length" description="暂无提醒" />
              <el-timeline v-else>
                <el-timeline-item
                  v-for="item in reminders"
                  :key="item.reminderId || item.id"
                  :timestamp="formatReminderDate(item)"
                  :type="reminderTagType(item)"
                >
                  <div class="timeline-row">
                    <div>
                      <div class="timeline-title">{{ item.title || item.reminderType || '复诊提醒' }}</div>
                      <div class="timeline-sub">
                        {{ item.petName ? `宠物：${item.petName}` : '全局提醒' }}
                      </div>
                    </div>
                    <el-tag size="small" :type="reminderTagType(item)">
                      {{ item.reminderType || item.type || '提醒' }}
                    </el-tag>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </template>
          </el-skeleton>
        </el-card>
      </section>

      <section v-else-if="activeMenu === 'tools'" class="section-block">
        <el-card shadow="hover" class="ops-card quick-card">
          <div class="card-header">
            <div>
              <div class="card-title">工具与模板</div>
              <div class="card-sub">诊疗模板、接诊设置与偏好</div>
            </div>
          </div>
          <el-row :gutter="12">
            <el-col v-for="tool in toolkits" :key="tool.title" :sm="12" :md="6" :span="6">
              <div class="quick-item tool-item" @click="tool.action()">
                <div class="quick-name">{{ tool.title }}</div>
                <div class="quick-desc">{{ tool.desc }}</div>
                <el-button :type="tool.type || 'primary'" text size="small">打开</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </section>
    </div>

    <el-dialog
      v-model="medicalEditorVisible"
      :title="editingMedicalId ? '编辑诊疗记录' : '新增诊疗记录'"
      width="760px"
      destroy-on-close
    >
      <el-form ref="medicalFormRef" :model="medicalForm" :rules="medicalRules" label-width="110px">
        <el-form-item label="快捷模板">
          <div class="template-inline">
            <el-select v-model="selectedTemplateKey" placeholder="选择模板后可一键填充" clearable filterable>
              <el-option
                v-for="tpl in medicalTemplates"
                :key="tpl.key"
                :label="tpl.title"
                :value="tpl.key"
              />
            </el-select>
            <el-button :disabled="!selectedTemplateKey" @click="applyMedicalTemplate(selectedTemplateKey)">
              应用模板
            </el-button>
          </div>
        </el-form-item>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="宠物" prop="petId">
              <el-select v-model="medicalForm.petId" placeholder="请选择宠物" filterable>
                <el-option
                  v-for="pet in petOptions"
                  :key="pet.petId"
                  :label="pet.petName"
                  :value="pet.petId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="就诊日期" prop="visitDate">
              <el-date-picker
                v-model="medicalForm.visitDate"
                type="date"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                placeholder="请选择就诊日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="医疗机构" prop="institutionId">
              <el-select
                v-model="medicalForm.institutionId"
                placeholder="请选择机构"
                filterable
                @change="handleMedicalInstitutionChange"
              >
                <el-option
                  v-for="item in institutionOptions"
                  :key="getInstitutionOptionValue(item)"
                  :label="getInstitutionOptionLabel(item)"
                  :value="getInstitutionOptionValue(item)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接诊医生" prop="vetUserId">
              <el-select
                v-model="medicalForm.vetUserId"
                placeholder="请选择医生"
                filterable
                :disabled="Boolean(currentVetId)"
              >
                <el-option
                  v-for="item in vetOptions"
                  :key="getVetOptionValue(item)"
                  :label="getVetOptionLabel(item)"
                  :value="getVetOptionValue(item)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="主诉" prop="reason">
          <el-input v-model="medicalForm.reason" type="textarea" :rows="2" placeholder="请输入主诉/症状描述" />
        </el-form-item>
        <el-form-item label="诊断">
          <el-input v-model="medicalForm.diagnosis" type="textarea" :rows="2" placeholder="请输入诊断结果" />
        </el-form-item>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="治疗方案">
              <el-input v-model="medicalForm.treatment" type="textarea" :rows="2" placeholder="输入治疗方案" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处方信息">
              <el-input v-model="medicalForm.prescription" type="textarea" :rows="2" placeholder="输入处方信息" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item label="费用">
              <el-input-number v-model="medicalForm.cost" :min="0" :step="10" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付状态">
              <el-select v-model="medicalForm.paymentStatus" placeholder="请选择">
                <el-option v-for="item in paymentStatusOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="记录状态">
              <el-select v-model="medicalForm.recordStatus" placeholder="请选择">
                <el-option v-for="item in recordStatusOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="复诊日期">
          <el-date-picker
            v-model="medicalForm.followUpDate"
            type="date"
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
            placeholder="可选"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="medicalEditorVisible = false">取消</el-button>
        <el-button type="primary" :loading="medicalSaving" @click="submitMedicalRecord">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="templateDialogVisible" title="诊疗模板" width="720px" destroy-on-close>
      <div class="template-grid">
        <div v-for="tpl in medicalTemplates" :key="tpl.key" class="template-card">
          <div class="template-title">{{ tpl.title }}</div>
          <div class="template-desc">{{ tpl.desc }}</div>
          <div class="template-meta">
            <span>记录状态：{{ tpl.recordStatus }}</span>
            <span>支付状态：{{ tpl.paymentStatus }}</span>
          </div>
          <el-button type="primary" text @click="applyTemplateAndCreate(tpl.key)">应用并新建记录</el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="templateDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="scheduleDialogVisible" title="接诊/预约设置" width="700px" destroy-on-close>
      <el-form label-width="130px">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="接诊开始时间">
              <el-time-picker
                v-model="scheduleSettings.startTime"
                value-format="HH:mm"
                format="HH:mm"
                placeholder="开始时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接诊结束时间">
              <el-time-picker
                v-model="scheduleSettings.endTime"
                value-format="HH:mm"
                format="HH:mm"
                placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="时间间隔（分钟）">
              <el-select v-model="scheduleSettings.slotMinutes">
                <el-option label="15" :value="15" />
                <el-option label="20" :value="20" />
                <el-option label="30" :value="30" />
                <el-option label="60" :value="60" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单日接诊上限">
              <el-input-number v-model="scheduleSettings.maxPerDay" :min="1" :max="200" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="允许预约类型">
          <el-checkbox-group v-model="scheduleSettings.allowedTypes">
            <el-checkbox v-for="type in allAppointmentTypes" :key="type" :label="type">
              {{ type }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="默认预约类型">
          <el-select v-model="scheduleSettings.defaultType" placeholder="请选择默认类型">
            <el-option
              v-for="type in scheduleSettings.allowedTypes"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建后自动确认">
          <el-switch v-model="scheduleSettings.autoConfirm" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="scheduleDialogVisible = false">取消</el-button>
        <el-button @click="resetScheduleSettings">恢复默认</el-button>
        <el-button type="primary" @click="saveScheduleSettings">保存设置</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="preferenceDialogVisible" title="通知与偏好" width="700px" destroy-on-close>
      <el-form label-width="130px">
        <el-form-item label="桌面通知">
          <el-switch v-model="preferenceSettings.desktopNotice" />
        </el-form-item>
        <el-form-item label="声音提醒">
          <el-switch v-model="preferenceSettings.soundNotice" />
        </el-form-item>
        <el-form-item label="自动刷新">
          <el-switch v-model="preferenceSettings.autoRefresh" />
        </el-form-item>
        <el-form-item label="刷新间隔（秒）">
          <el-select v-model="preferenceSettings.refreshSeconds" :disabled="!preferenceSettings.autoRefresh">
            <el-option v-for="item in refreshIntervalOptions" :key="item" :label="`${item} 秒`" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="提醒提前量（小时）">
          <el-input-number v-model="preferenceSettings.reminderLeadHours" :min="1" :max="168" />
        </el-form-item>
        <el-form-item label="主题模式">
          <el-radio-group v-model="preferenceSettings.themeMode">
            <el-radio-button v-for="item in themeModeOptions" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="界面语言">
          <el-select v-model="preferenceSettings.language">
            <el-option
              v-for="item in languageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="preferenceDialogVisible = false">取消</el-button>
        <el-button @click="resetPreferenceSettings">恢复默认</el-button>
        <el-button type="primary" @click="savePreferenceSettings">保存设置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Monitor, List, Document, Bell, Tools } from '@element-plus/icons-vue'
import {
  getAppointmentList,
  addAppointment,
  confirmAppointment,
  deleteAppointment
} from '@/api/appointment'
import {
  addMedicalRecord,
  deleteMedicalRecord,
  getDailyStats,
  getInstitutions,
  getMedications,
  getMedicalRecords,
  getOverviewStats,
  getVetInstitution,
  getVets,
  updateMedicalRecord
} from '@/api/health'
import { getUpcomingReminders } from '@/api/reminder'
import { getPetList } from '@/api/pet'
import { useAuthStore } from '@/stores/auth'
import { applyLanguage, applyThemeMode, loadPreferences } from '@/utils/preferences'
import brandLogo from '@/assets/images/logo.png'
import TreatWorkbench from './components/TreatWorkbench.vue'
import AppointmentManager from './components/AppointmentManager.vue'

const router = useRouter()
const authStore = useAuthStore()
const handleLogout = async () => {
  await authStore.logout?.()
  router.push('/login')
}

const appointmentLoading = ref(false)
const recordLoading = ref(false)
const reminderLoading = ref(false)
const medicationLoading = ref(false)
const medicalSaving = ref(false)

const upcomingAppointments = ref([])
const recentRecords = ref([])
const reminders = ref([])
const medicationRecords = ref([])
const petOptions = ref([])
const institutionOptions = ref([])
const vetOptions = ref([])

const activeMenu = ref('overview')
const institutionName = ref('')
const institutionId = ref(null)
const templateDialogVisible = ref(false)
const medicalEditorVisible = ref(false)
const editingMedicalId = ref(null)
const selectedTemplateKey = ref('')
const medicalFormRef = ref(null)
const scheduleDialogVisible = ref(false)
const preferenceDialogVisible = ref(false)
const refreshTimer = ref(null)
const remindSnapshot = ref('')

const workloadStats = ref({
  pendingCount: 0,
  confirmedCount: 0,
  completedCount: 0,
  cancelledCount: 0
})
const overviewStats = ref({
  today: { appointments: 0, patients: 0, medications: 0 },
  week: { appointments: 0, patients: 0, medications: 0 },
  month: { appointments: 0, patients: 0, medications: 0 }
})

const paymentStatusOptions = ['未支付', '部分支付', '已支付', '保险支付']
const recordStatusOptions = ['初诊', '复诊', '急诊', '体检']
const allAppointmentTypes = ['诊疗', '体检', '疫苗接种', '复诊', '急诊', '其他']
const refreshIntervalOptions = [30, 60, 120, 300]

const SCHEDULE_STORAGE_KEY = 'medicalOpsScheduleSettings'
const PREF_STORAGE_KEY = 'medicalOpsPreferenceSettings'

const scheduleSettingsDefault = {
  startTime: '09:00',
  endTime: '18:00',
  slotMinutes: 30,
  maxPerDay: 20,
  allowedTypes: [...allAppointmentTypes],
  defaultType: '诊疗',
  autoConfirm: false
}
const scheduleSettings = reactive({ ...scheduleSettingsDefault })

const appearanceDefaults = loadPreferences()
const preferenceDefaults = {
  desktopNotice: false,
  soundNotice: false,
  autoRefresh: true,
  refreshSeconds: 60,
  reminderLeadHours: 24,
  themeMode: appearanceDefaults.themeMode || 'light',
  language: appearanceDefaults.language || 'zh-CN'
}
const preferenceSettings = reactive({ ...preferenceDefaults })

const languageOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
]

const themeModeOptions = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
  { label: '跟随系统', value: 'system' }
]
const medicalTemplates = [
  {
    key: 'initial-check',
    title: '通用初诊模板',
    desc: '适用于初次到诊，便于快速留存结构化病历',
    reason: '精神一般，主人反馈近期食欲与排便异常，需进一步检查',
    diagnosis: '待检查（建议结合体温、触诊及基础化验）',
    treatment: '先进行基础检查，结合结果制定后续方案',
    prescription: '暂未开立处方',
    recordStatus: '初诊',
    paymentStatus: '未支付'
  },
  {
    key: 'follow-up',
    title: '复诊随访模板',
    desc: '用于慢病或疗程中复诊，突出症状变化与疗效评估',
    reason: '按医嘱复诊，复核既往症状变化与恢复情况',
    diagnosis: '较前改善，建议维持当前治疗并继续观察',
    treatment: '延续原方案，必要时调整剂量并记录不良反应',
    prescription: '继续既往处方，补充家庭护理建议',
    recordStatus: '复诊',
    paymentStatus: '部分支付'
  },
  {
    key: 'emergency',
    title: '急诊处置模板',
    desc: '适用于急性症状，快速记录主诉、初步诊断与应急措施',
    reason: '突发呕吐/腹泻或精神萎靡，紧急接诊',
    diagnosis: '疑似急性胃肠应激或感染，待进一步确诊',
    treatment: '先行补液/止吐等对症处理，后续根据化验结果调整',
    prescription: '急诊用药已执行，出院后按时复诊',
    recordStatus: '急诊',
    paymentStatus: '已支付'
  }
]

const medicalFormInitial = {
  petId: '',
  institutionId: '',
  vetUserId: '',
  visitDate: '',
  reason: '',
  diagnosis: '',
  treatment: '',
  prescription: '',
  cost: null,
  paymentStatus: '未支付',
  recordStatus: '初诊',
  followUpDate: ''
}
const medicalForm = reactive({ ...medicalFormInitial })
const medicalRules = {
  petId: [{ required: true, message: '请选择宠物', trigger: 'change' }],
  institutionId: [{ required: true, message: '请选择医疗机构', trigger: 'change' }],
  vetUserId: [{ required: true, message: '请选择接诊医生', trigger: 'change' }],
  visitDate: [{ required: true, message: '请选择就诊日期', trigger: 'change' }],
  reason: [{ required: true, message: '请输入主诉', trigger: 'blur' }]
}

const veterinarianName = computed(
  () => authStore.userInfo?.username || authStore.username || '兽医'
)
const currentVetId = computed(() => authStore.userInfo?.userId || authStore.userInfo?.id || null)

const normalizeRole = (role) => (role || '').toString().toLowerCase().trim()
const isVetRole = (roleText) => {
  const normalized = normalizeRole(roleText)
  const keywords = ['兽医', '医生', '医师', 'veterinarian', 'doctor', 'clinic', 'medical']
  if (keywords.some((kw) => normalized.includes(kw))) return true
  return ['vet', 'dr'].includes(normalized)
}

const isVeterinarian = computed(() => {
  const roles = [
    authStore.userRole,
    authStore.userInfo?.roleName,
    authStore.userInfo?.role,
    localStorage.getItem('userRole')
  ]
  if (Array.isArray(authStore.userInfo?.roles)) {
    roles.push(
      ...authStore.userInfo.roles.map((item) =>
        typeof item === 'string' ? item : item?.name || ''
      )
    )
  }
  const mergedText = roles.filter(Boolean).map(normalizeRole).join(' ')
  return isVetRole(mergedText) || roles.some((role) => isVetRole(role))
})

const getInstitutionOptionValue = (item) =>
  item?.id ?? item?.institutionId ?? item?.value ?? null

const getInstitutionOptionLabel = (item) =>
  item?.name ?? item?.institutionName ?? item?.label ?? ''

const getVetOptionValue = (item) =>
  item?.id ?? item?.userId ?? item?.vetUserId ?? item?.value ?? null

const getVetOptionLabel = (item) =>
  item?.name ?? item?.username ?? item?.vetName ?? item?.label ?? ''

const toOptionalNumber = (val) => {
  if (val === '' || val === null || val === undefined) return null
  return Number(val)
}

const getTodayDate = () => new Date().toISOString().slice(0, 10)
const getDefaultPetId = () => petOptions.value[0]?.petId || ''
const getDefaultInstitutionId = () =>
  institutionId.value || getInstitutionOptionValue(institutionOptions.value[0]) || ''
const getDefaultVetId = () =>
  currentVetId.value || getVetOptionValue(vetOptions.value[0]) || ''

const resetMedicalForm = (overrides = {}) => {
  Object.assign(medicalForm, {
    ...medicalFormInitial,
    petId: getDefaultPetId(),
    institutionId: getDefaultInstitutionId(),
    vetUserId: getDefaultVetId(),
    visitDate: getTodayDate(),
    ...overrides
  })
  if (currentVetId.value) {
    medicalForm.vetUserId = Number(currentVetId.value)
  }
}

const scheduleHint = computed(
  () =>
    `接诊时间 ${scheduleSettings.startTime}-${scheduleSettings.endTime}，间隔 ${scheduleSettings.slotMinutes} 分钟，单日上限 ${scheduleSettings.maxPerDay} 单`
)

const defaultAppointmentType = computed(() => {
  if (scheduleSettings.allowedTypes.includes(scheduleSettings.defaultType)) return scheduleSettings.defaultType
  return scheduleSettings.allowedTypes[0] || '诊疗'
})

const formatTimeToMinutes = (value) => {
  if (!value || typeof value !== 'string') return null
  const [h, m] = value.split(':').map((item) => Number(item))
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  return h * 60 + m
}

const isTimeWithinSchedule = (timeText) => {
  if (!timeText) return true
  const inputMins = formatTimeToMinutes(timeText.slice(0, 5))
  const start = formatTimeToMinutes(scheduleSettings.startTime)
  const end = formatTimeToMinutes(scheduleSettings.endTime)
  if (inputMins === null || start === null || end === null) return true
  if (start >= end) return false
  return inputMins >= start && inputMins <= end
}

const isTimeAligned = (timeText) => {
  if (!timeText) return true
  const inputMins = formatTimeToMinutes(timeText.slice(0, 5))
  const start = formatTimeToMinutes(scheduleSettings.startTime)
  if (inputMins === null || start === null) return true
  const delta = inputMins - start
  return delta >= 0 && delta % Number(scheduleSettings.slotMinutes || 30) === 0
}

const countAppointmentsByDate = (date) => {
  if (!date) return 0
  return vetAppointments.value.filter((item) => item.appointmentDate === date).length
}

const playReminderSound = () => {
  if (!preferenceSettings.soundNotice || typeof window === 'undefined') return
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = 880
    gain.gain.value = 0.02
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start()
    oscillator.stop(ctx.currentTime + 0.12)
  } catch (error) {
    console.warn('播放提醒音失败', error)
  }
}

const notifyUpcomingReminder = () => {
  if (!preferenceSettings.desktopNotice || typeof window === 'undefined' || !('Notification' in window)) return
  if (!reminders.value.length) return
  const first = reminders.value[0]
  const dueText = `${first?.dueDate || first?.reminderDate || ''} ${first?.reminderTime || '00:00'}`
  const dueTs = new Date(dueText).getTime()
  if (!Number.isNaN(dueTs)) {
    const gapHours = (dueTs - Date.now()) / 3600000
    if (gapHours > Number(preferenceSettings.reminderLeadHours || 24)) return
  }
  const signature = `${first.reminderId || first.id || 'x'}-${reminders.value.length}`
  if (signature === remindSnapshot.value) return
  remindSnapshot.value = signature

  const body = first?.title || first?.message || first?.reminderType || '你有新的随访提醒'
  const createNotice = () => {
    try {
      // eslint-disable-next-line no-new
      new Notification('医疗操作中心提醒', { body })
      playReminderSound()
    } catch (error) {
      console.warn('发送桌面通知失败', error)
    }
  }

  if (Notification.permission === 'granted') {
    createNotice()
    return
  }
  if (Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') createNotice()
    })
  }
}

const clearRefreshTimer = () => {
  if (!refreshTimer.value) return
  clearInterval(refreshTimer.value)
  refreshTimer.value = null
}

const setupAutoRefresh = () => {
  clearRefreshTimer()
  if (!preferenceSettings.autoRefresh) return
  const ms = Math.max(10, Number(preferenceSettings.refreshSeconds || 60)) * 1000
  refreshTimer.value = setInterval(() => {
    loadAppointments()
    loadReminders()
    loadStats()
  }, ms)
}

const saveScheduleSettings = () => {
  if (!scheduleSettings.allowedTypes.length) {
    ElMessage.warning('至少保留一个预约类型')
    return
  }
  if (!scheduleSettings.allowedTypes.includes(scheduleSettings.defaultType)) {
    scheduleSettings.defaultType = scheduleSettings.allowedTypes[0]
  }
  const start = formatTimeToMinutes(scheduleSettings.startTime)
  const end = formatTimeToMinutes(scheduleSettings.endTime)
  if (start === null || end === null || start >= end) {
    ElMessage.warning('接诊时间范围无效')
    return
  }
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify({ ...scheduleSettings }))
  scheduleDialogVisible.value = false
  ElMessage.success('接诊/预约设置已保存')
}

const savePreferenceSettings = () => {
  localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify({ ...preferenceSettings }))
  applyThemeMode(preferenceSettings.themeMode)
  applyLanguage(preferenceSettings.language)
  setupAutoRefresh()
  preferenceDialogVisible.value = false
  ElMessage.success('通知与偏好已保存')
}

const resetScheduleSettings = () => {
  Object.assign(scheduleSettings, { ...scheduleSettingsDefault, allowedTypes: [...allAppointmentTypes] })
}

const resetPreferenceSettings = () => {
  Object.assign(preferenceSettings, { ...preferenceDefaults })
}

const loadOpsSettings = () => {
  try {
    const scheduleRaw = localStorage.getItem(SCHEDULE_STORAGE_KEY)
    if (scheduleRaw) {
      const parsed = JSON.parse(scheduleRaw)
      Object.assign(scheduleSettings, {
        ...scheduleSettingsDefault,
        ...parsed,
        allowedTypes: Array.isArray(parsed?.allowedTypes) && parsed.allowedTypes.length
          ? parsed.allowedTypes
          : [...allAppointmentTypes]
      })
    } else {
      resetScheduleSettings()
    }
  } catch (error) {
    console.warn('解析接诊设置失败，已使用默认值', error)
    resetScheduleSettings()
  }

  try {
    const prefRaw = localStorage.getItem(PREF_STORAGE_KEY)
    if (prefRaw) {
      Object.assign(preferenceSettings, { ...preferenceDefaults, ...JSON.parse(prefRaw) })
    } else {
      resetPreferenceSettings()
    }
  } catch (error) {
    console.warn('解析通知偏好失败，已使用默认值', error)
    resetPreferenceSettings()
  }
  applyThemeMode(preferenceSettings.themeMode, false)
  applyLanguage(preferenceSettings.language)
}

const vetAppointments = computed(() => {
  if (!currentVetId.value) return upcomingAppointments.value
  return upcomingAppointments.value.filter((item) => {
    const vid =
      item.vetUserId ??
      item.vetId ??
      item.doctorId ??
      item.veterinarianId ??
      item.veterinarianUserId
    return Number(vid) === Number(currentVetId.value)
  })
})

const todayPending = computed(() =>
  vetAppointments.value.filter(
    (item) => isToday(item.appointmentDate) && ['待确认', 'pending'].includes(statusText(item.status))
  )
)
const todayConfirmed = computed(() =>
  vetAppointments.value.filter(
    (item) =>
      isToday(item.appointmentDate) &&
      ['已确认', 'confirmed', '已完成', 'completed'].includes(statusText(item.status))
  )
)

const loadAppointments = async () => {
  try {
    appointmentLoading.value = true
    const params = { size: 50 }
    if (currentVetId.value) params.vetUserId = currentVetId.value
    const res = await getAppointmentList(params)
    upcomingAppointments.value = res?.data?.records || []
  } catch (error) {
    console.error('加载预约列表失败', error)
    ElMessage.error(error?.message || '加载预约列表失败')
  } finally {
    appointmentLoading.value = false
  }
}

const loadMedicalRecords = async () => {
  try {
    recordLoading.value = true
    const res = await getMedicalRecords(
      currentVetId.value ? { vetUserId: currentVetId.value } : {}
    )
    const list = res?.data || []
    recentRecords.value = list.slice(0, 20)
  } catch (error) {
    console.error('加载医疗记录失败', error)
    ElMessage.error(error?.message || '加载医疗记录失败')
  } finally {
    recordLoading.value = false
  }
}

const loadReminders = async () => {
  try {
    reminderLoading.value = true
    const res = await getUpcomingReminders({ size: 5 })
    reminders.value = res?.data?.records || []
  } catch (error) {
    console.error('加载提醒失败', error)
    ElMessage.error(error?.message || '加载提醒失败')
  } finally {
    reminderLoading.value = false
  }
}

const loadMedications = async () => {
  try {
    medicationLoading.value = true
    if (!currentVetId.value) {
      medicationRecords.value = []
      return
    }
    const params = { vetUserId: currentVetId.value, size: 50 }
    const res = await getMedications(params)
    const list = res?.data?.records || res?.data || []
    medicationRecords.value = list
  } catch (error) {
    console.error('加载用药记录失败', error)
    ElMessage.error(error?.message || '加载用药记录失败')
  } finally {
    medicationLoading.value = false
  }
}

const loadStats = async () => {
  if (!currentVetId.value) return
  try {
    const [daily, overview] = await Promise.all([
      getDailyStats({ vetUserId: currentVetId.value }),
      getOverviewStats({ vetUserId: currentVetId.value })
    ])
    workloadStats.value = {
      pendingCount: daily?.data?.pendingCount ?? 0,
      confirmedCount: daily?.data?.confirmedCount ?? 0,
      completedCount: daily?.data?.completedCount ?? 0,
      cancelledCount: daily?.data?.cancelledCount ?? 0
    }
    overviewStats.value = overview?.data || {
      today: { appointments: 0, patients: 0, medications: 0 },
      week: { appointments: 0, patients: 0, medications: 0 },
      month: { appointments: 0, patients: 0, medications: 0 }
    }
  } catch (error) {
    console.error('加载工作量统计失败', error)
    ElMessage.error(error?.message || '加载工作量统计失败')
  }
}

const loadInstitution = async () => {
  if (!currentVetId.value) {
    institutionId.value = null
    institutionName.value = ''
    return
  }
  try {
    const res = await getVetInstitution(currentVetId.value)
    institutionId.value = res?.data?.id ?? res?.data?.institutionId ?? null
    institutionName.value = res?.data?.name ?? res?.data?.institutionName ?? ''
    if (!medicalForm.institutionId) {
      medicalForm.institutionId = institutionId.value
    }
  } catch (error) {
    console.error('加载机构失败', error)
    institutionId.value = null
    institutionName.value = ''
  }
}

const loadPets = async () => {
  try {
    const res = await getPetList({ page: 1, size: 100, scope: 'all' })
    petOptions.value = res?.data?.records || []
    if (!medicalForm.petId && petOptions.value.length) {
      medicalForm.petId = getDefaultPetId()
    }
  } catch (error) {
    console.error('加载宠物列表失败', error)
  }
}

const loadMedicalMeta = async () => {
  try {
    const [instRes, vetRes] = await Promise.all([getInstitutions(), getVets()])
    institutionOptions.value = instRes?.data || []
    vetOptions.value = vetRes?.data || []
    if (!medicalForm.institutionId) {
      medicalForm.institutionId = getDefaultInstitutionId()
    }
    if (!medicalForm.vetUserId) {
      medicalForm.vetUserId = getDefaultVetId()
    }
  } catch (error) {
    console.error('加载机构与医生选项失败', error)
    ElMessage.error(error?.message || '加载机构与医生失败')
  }
}

const loadVetsByInstitution = async (institution) => {
  try {
    const institutionValue = toOptionalNumber(institution)
    const params = institutionValue ? { institutionId: institutionValue } : {}
    const vetRes = await getVets(params)
    vetOptions.value = vetRes?.data || []
    if (currentVetId.value) {
      medicalForm.vetUserId = Number(currentVetId.value)
      return
    }
    if (
      !vetOptions.value.some(
        (item) => Number(getVetOptionValue(item)) === Number(toOptionalNumber(medicalForm.vetUserId))
      )
    ) {
      medicalForm.vetUserId = getDefaultVetId()
    }
  } catch (error) {
    console.error('按机构加载医生失败', error)
    ElMessage.error(error?.message || '加载医生列表失败')
  }
}

const handleMedicalInstitutionChange = async (val) => {
  await loadVetsByInstitution(val)
}

const handleCreateAppointment = async (formPayload) => {
  try {
    if (!formPayload.petId || !formPayload.appointmentDate) {
      ElMessage.warning('请选择宠物并填写预约日期')
      return
    }
    const appointmentType = formPayload.appointmentType || defaultAppointmentType.value
    if (!scheduleSettings.allowedTypes.includes(appointmentType)) {
      ElMessage.warning(`预约类型需在设置范围内：${scheduleSettings.allowedTypes.join(' / ')}`)
      return
    }
    if (!isTimeWithinSchedule(formPayload.appointmentTime || '')) {
      ElMessage.warning(`预约时间需在接诊时段 ${scheduleSettings.startTime}-${scheduleSettings.endTime} 内`)
      return
    }
    if (!isTimeAligned(formPayload.appointmentTime || '')) {
      ElMessage.warning(`预约时间需按 ${scheduleSettings.slotMinutes} 分钟间隔选择`)
      return
    }
    const dailyCount = countAppointmentsByDate(formPayload.appointmentDate)
    if (dailyCount >= Number(scheduleSettings.maxPerDay || 20)) {
      ElMessage.warning(`该日期预约数量已达上限（${scheduleSettings.maxPerDay}）`)
      return
    }

    const payload = {
      ...formPayload,
      petId: Number(formPayload.petId),
      appointmentTime: formPayload.appointmentTime || null,
      institutionId: formPayload.institutionId || institutionId.value || null,
      vetUserId: currentVetId.value || formPayload.vetUserId || null,
      appointmentType,
      status: scheduleSettings.autoConfirm ? '已确认' : (formPayload.status || '待确认')
    }
    await addAppointment(payload)
    ElMessage.success('已创建预约')
    await Promise.all([loadAppointments(), loadStats()])
  } catch (error) {
    console.error('创建预约失败', error)
    ElMessage.error(error?.message || '创建预约失败')
  }
}

const handleConfirmAppointment = async (id) => {
  try {
    await confirmAppointment(id)
    ElMessage.success('预约已确认')
    await Promise.all([loadAppointments(), loadStats()])
  } catch (error) {
    console.error('确认预约失败', error)
    ElMessage.error(error?.message || '确认预约失败')
  }
}

const handleCancelAppointment = async (id) => {
  try {
    await deleteAppointment(id)
    ElMessage.success('预约已取消')
    await Promise.all([loadAppointments(), loadStats()])
  } catch (error) {
    console.error('取消预约失败', error)
    ElMessage.error(error?.message || '取消预约失败')
  }
}

const applyMedicalTemplate = (templateKey, showToast = true) => {
  const matched = medicalTemplates.find((item) => item.key === templateKey)
  if (!matched) return
  Object.assign(medicalForm, {
    reason: matched.reason,
    diagnosis: matched.diagnosis,
    treatment: matched.treatment,
    prescription: matched.prescription,
    paymentStatus: matched.paymentStatus,
    recordStatus: matched.recordStatus
  })
  if (showToast) ElMessage.success(`已应用模板：${matched.title}`)
}

const openMedicalTemplateDialog = () => {
  templateDialogVisible.value = true
}

const openCreateMedicalRecord = (templateKey = '') => {
  activeMenu.value = 'records'
  editingMedicalId.value = null
  selectedTemplateKey.value = templateKey || ''
  resetMedicalForm()
  medicalEditorVisible.value = true
  if (templateKey) {
    applyMedicalTemplate(templateKey, false)
  }
}

const openEditMedicalRecord = (row) => {
  if (!row) return
  activeMenu.value = 'records'
  editingMedicalId.value = row.id || row.recordId || null
  selectedTemplateKey.value = ''
  resetMedicalForm({
    petId: row.petId || '',
    institutionId: row.institutionId ?? getDefaultInstitutionId(),
    vetUserId: row.vetUserId ?? getDefaultVetId(),
    visitDate: row.visitDate || '',
    reason: row.reason || '',
    diagnosis: row.diagnosis || '',
    treatment: row.treatment || '',
    prescription: row.prescription || '',
    cost: row.cost === '' || row.cost === undefined ? null : Number(row.cost),
    paymentStatus: row.paymentStatus || '未支付',
    recordStatus: row.recordStatus || '初诊',
    followUpDate: row.followUpDate || ''
  })
  medicalEditorVisible.value = true
}

const applyTemplateAndCreate = (templateKey) => {
  templateDialogVisible.value = false
  openCreateMedicalRecord(templateKey)
}

const submitMedicalRecord = async () => {
  try {
    await medicalFormRef.value?.validate()
    medicalSaving.value = true

    const payload = {
      ...medicalForm,
      petId: Number(medicalForm.petId),
      institutionId: toOptionalNumber(medicalForm.institutionId),
      vetUserId: currentVetId.value
        ? Number(currentVetId.value)
        : toOptionalNumber(medicalForm.vetUserId),
      cost: medicalForm.cost === '' || medicalForm.cost === null ? null : Number(medicalForm.cost)
    }
    if (!payload.institutionId || !payload.vetUserId) {
      ElMessage.warning('请选择机构与接诊医生')
      return
    }

    if (editingMedicalId.value) {
      await updateMedicalRecord(editingMedicalId.value, payload)
      ElMessage.success('诊疗记录已更新')
    } else {
      await addMedicalRecord(payload)
      ElMessage.success('新增诊疗记录成功')
    }
    medicalEditorVisible.value = false
    editingMedicalId.value = null
    await Promise.all([loadMedicalRecords(), loadStats()])
  } catch (error) {
    console.error('保存诊疗记录失败', error)
    ElMessage.error(error?.message || '保存诊疗记录失败')
  } finally {
    medicalSaving.value = false
  }
}

const handleDeleteMedicalRecord = async (row) => {
  const id = row?.id || row?.recordId
  if (!id) {
    ElMessage.warning('缺少记录ID')
    return
  }
  try {
    await deleteMedicalRecord(id)
    ElMessage.success('诊疗记录已删除')
    await Promise.all([loadMedicalRecords(), loadStats()])
  } catch (error) {
    console.error('删除诊疗记录失败', error)
    ElMessage.error(error?.message || '删除诊疗记录失败')
  }
}

const handleMenuSelect = (key) => {
  activeMenu.value = key
  if (key === 'appointments' || key === 'treat') {
    loadAppointments()
    return
  }
  if (key === 'records') {
    loadMedicalRecords()
    return
  }
  if (key === 'medications') {
    loadMedications()
    return
  }
  if (key === 'reminders') {
    loadReminders()
  }
}

const goAppointments = () => {
  activeMenu.value = 'appointments'
  loadAppointments()
}

const goMedicalRecords = () => {
  activeMenu.value = 'records'
  loadMedicalRecords()
}

const menuItems = [
  { key: 'overview', label: '工作台总览', desc: '今日重点与入口', icon: Monitor },
  { key: 'treat', label: '接诊工作台', desc: '今日待诊与现场接诊', icon: Monitor },
  { key: 'appointments', label: '预约管理', desc: '预约确认与分配', icon: List },
  { key: 'medications', label: '用药记录', desc: '用药方案与进度', icon: Document },
  { key: 'records', label: '诊疗记录', desc: '病历与治疗方案', icon: Document },
  { key: 'reminders', label: '随访提醒', desc: '复诊与用药提醒', icon: Bell },
  { key: 'tools', label: '工具与模板', desc: '配置与常用模板', icon: Tools }
]

const quickActions = [
  {
    title: '接诊面板',
    desc: '查看并确认待诊/预约',
    type: 'primary',
    action: () => goAppointments()
  },
  {
    title: '快速记录诊疗',
    desc: '录入诊断、用药与建议',
    type: 'success',
    action: () => openCreateMedicalRecord()
  },
  {
    title: '免疫 / 驱虫',
    desc: '维护疫苗与驱虫记录',
    type: 'warning',
    action: () => router.push('/vaccinations')
  },
  {
    title: '随访提醒',
    desc: '安排复诊、用药与随访提醒',
    type: 'info',
    action: () => router.push('/reminders')
  }
]

const toolkits = [
  {
    title: '诊疗模板',
    desc: '复用常用病历/处置模板',
    type: 'primary',
    action: () => openMedicalTemplateDialog()
  },
  {
    title: '诊疗记录面板',
    desc: '一键跳转到医疗记录页面',
    type: 'success',
    action: () => goMedicalRecords()
  },
  {
    title: '接诊/预约设置',
    desc: '调整接诊时间、类型与数量',
    type: 'warning',
    action: () => {
      scheduleDialogVisible.value = true
    }
  },
  {
    title: '通知与偏好',
    desc: '桌面通知、主题等偏好',
    type: 'info',
    action: () => {
      preferenceDialogVisible.value = true
    }
  }
]

const statusType = (status) => {
  const map = {
    待确认: 'warning',
    已确认: 'primary',
    已完成: 'success',
    已取消: 'danger',
    pending: 'warning',
    confirmed: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  const normalized = status?.toLowerCase?.() || status
  return map[status] || map[normalized] || 'info'
}

const statusText = (status) => {
  const normalized = status?.toLowerCase?.()
  const map = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[normalized] || status || '预约'
}

const isToday = (dateStr) => {
  if (!dateStr) return false
  const today = new Date()
  const [y, m, d] = [today.getFullYear(), today.getMonth(), today.getDate()]
  const target = new Date(dateStr)
  return (
    !Number.isNaN(target.getTime()) &&
    target.getFullYear() === y &&
    target.getMonth() === m &&
    target.getDate() === d
  )
}

const reminderTagType = (item) => {
  const typeText = (item?.reminderType || item?.type || '').toLowerCase()
  if (typeText.includes('疫苗') || typeText.includes('免疫')) return 'success'
  if (typeText.includes('复诊') || typeText.includes('预约')) return 'warning'
  return 'info'
}

const formatReminderDate = (item) => {
  const date = item.dueDate || item.reminderDate || item.nextDueDate || ''
  const time = item.reminderTime || ''
  return [date, time].filter(Boolean).join(' ')
}

watch(
  () => reminders.value,
  () => {
    notifyUpcomingReminder()
  },
  { deep: true }
)

watch(
  () => scheduleSettings.allowedTypes,
  (list) => {
    if (!Array.isArray(list) || !list.length) return
    if (!list.includes(scheduleSettings.defaultType)) {
      scheduleSettings.defaultType = list[0]
    }
  },
  { deep: true }
)

onMounted(async () => {
  if (!authStore.userInfo || !authStore.userRole) {
    try {
      await authStore.fetchUserInfo()
    } catch (error) {
      console.error('刷新用户信息失败', error)
    }
  }

  if (!isVeterinarian.value) {
    ElMessage.warning('未识别为兽医账号，将以通用模式打开医疗操作中心')
  }

  loadOpsSettings()
  await Promise.all([loadPets(), loadMedicalMeta(), loadInstitution()])
  if (institutionId.value) {
    await loadVetsByInstitution(institutionId.value)
  }
  resetMedicalForm()

  await Promise.all([
    loadAppointments(),
    loadMedicalRecords(),
    loadReminders(),
    loadMedications(),
    loadStats()
  ])
  setupAutoRefresh()
})

onBeforeUnmount(() => {
  clearRefreshTimer()
})
</script>

<style scoped>
.ops-layout {
  display: grid;
  grid-template-columns: 252px 1fr;
  min-height: 100vh;
  background: var(--bg);
}

.ops-sider {
  position: sticky;
  top: 0;
  height: 100vh;
  background: #0f172a;
  color: #fff;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-right: 1px solid #213352;
}

.sider-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0 14px;
  cursor: pointer;
  border-bottom: 1px solid rgba(209, 224, 248, 0.2);
}

.brand-logo {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: #fff;
  padding: 4px;
  border: 1px solid #bfd0e7;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: translateY(4px) scale(1.5);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-title {
  font-weight: 800;
  font-size: 16px;
}

.brand-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.sider-title {
  font-weight: 800;
  font-size: 16px;
  color: #ffffff;
  letter-spacing: 0.3px;
}

.sider-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 2px 0 8px;
}

.sider-menu-wrapper {
  flex: 1;
  overflow-y: auto;
  margin: 6px 0;
  padding-right: 2px;
}

.sider-menu {
  border-right: none;
  background: transparent;
  --el-menu-text-color: rgba(255, 255, 255, 0.92);
  --el-menu-hover-bg-color: rgba(255, 255, 255, 0.08);
  --el-menu-active-color: #fff;
}

.sider-menu :deep(.el-menu-item) {
  border-radius: 0;
  border-left: 2px solid transparent;
  margin-bottom: 6px;
  height: 46px;
  line-height: 46px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
}

.sider-menu :deep(.el-menu-item.is-active) {
  background: rgba(64, 158, 255, 0.16);
  border-left-color: #78b4ff;
}

.menu-icon {
  color: #cde0ff;
}

.menu-label {
  font-weight: 700;
}

.menu-desc {
  font-size: 12px;
  color: #c9d9f4;
}

.menu-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.account-block {
  color: #e5eaf5;
  margin-top: auto;
  padding: 10px 0 0;
  border-top: 1px solid rgba(209, 224, 248, 0.2);
}

.account-label {
  font-size: 12px;
  opacity: 0.8;
}

.account-name {
  font-size: 16px;
  font-weight: 700;
  margin-top: 4px;
  word-break: break-all;
}

.back-home {
  margin-top: 8px;
  width: 100%;
  border-radius: 0;
  position: sticky;
  bottom: 12px;
}

.ops-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 26px 30px;
  min-height: 100vh;
  overflow-y: auto;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-row {
  margin-bottom: 0;
}

.overview-row {
  margin-bottom: 2px;
}

.stat-card {
  background: var(--surface-1);
  border: none;
  border-left: 3px solid var(--brand);
  padding: 12px 14px;
  min-height: 84px;
}

.stat-card-soft {
  border-left-color: var(--border);
  background: var(--surface-2);
}

.stat-label {
  font-size: 13px;
  color: var(--text-3);
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-1);
  margin-top: 4px;
}

.ops-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2px 0 16px;
  border-bottom: 1px solid var(--border);
  gap: 16px;
  color: var(--text-1);
}

.hero-text {
  max-width: 760px;
}

.eyebrow {
  font-size: 13px;
  font-weight: 700;
  color: var(--brand);
  letter-spacing: 0.4px;
  margin-bottom: 6px;
}

.hero-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-1);
  margin: 0 0 8px;
}

.hero-sub {
  color: var(--text-2);
  margin-bottom: 12px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 10px;
}

.hero-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

.ops-card {
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
  background: transparent;
  border: none;
}

.quick-card .el-row {
  margin-top: 8px;
}

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

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.template-inline {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.template-grid {
  display: block;
}

.template-card {
  border: 0;
  border-radius: 0;
  background: transparent;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.template-card + .template-card {
  border-top: 1px solid var(--border);
}

.template-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-1);
}

.template-desc {
  color: var(--text-3);
  font-size: 13px;
  line-height: 1.5;
  min-height: 0;
}

.template-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--text-3);
  font-size: 13px;
}

.quick-item {
  background: var(--surface-2);
  border: none;
  border-left: 3px solid var(--border);
  border-radius: 0;
  padding: 12px 12px 10px;
  min-height: 120px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.quick-item:hover {
  border-left-color: var(--brand);
  background: var(--surface-3);
}

.quick-name {
  font-weight: 700;
  color: var(--text-1);
  margin-bottom: 4px;
}

.quick-desc {
  font-size: 13px;
  color: var(--text-3);
  flex: 1;
}

.tool-item {
  min-height: 140px;
}

.timeline-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.timeline-title {
  font-weight: 700;
  color: var(--text-1);
}

.timeline-sub {
  font-size: 13px;
  color: var(--text-3);
}

:deep(.el-table) {
  --el-table-border-color: var(--border);
}

:deep(.el-table th.el-table__cell) {
  background: var(--surface-2);
  color: var(--text-2);
  font-weight: 600;
}

:deep(.el-table .el-table__cell) {
  border-color: var(--border);
}

:deep(.el-table--border::after),
:deep(.el-table::before) {
  background: var(--border);
}

@media (max-width: 960px) {
  .ops-layout {
    grid-template-columns: 1fr;
  }

  .ops-sider {
    position: relative;
    width: 100%;
    height: auto;
    top: auto;
  }

  .ops-main {
    min-height: auto;
    padding: 16px;
  }

  .ops-hero {
    flex-direction: column;
  }

  .hero-meta {
    align-items: flex-start;
  }

  .template-grid {
    grid-template-columns: 1fr;
  }

  .template-inline {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 24px;
  }
}
</style>
