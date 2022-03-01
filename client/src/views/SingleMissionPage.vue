<template>
  <div class="content">
    <n-h1 prefix="bar" style="display: flex; align-items: center">
      <n-icon style="margin-right: 8px">
        <pencil-outline />
      </n-icon>
      Add a Mission
    </n-h1>
    <n-card title="Add Mission">
      <n-form
        :rules="rules"
        :label-width="80"
        :model="formValue"
        size="medium"
        ref="formRef"
      >
        <n-grid :span="24" :x-gap="24">
          <n-form-item-gi :span="10" label="Departure Date (z)" path="dd_zulu">
            <n-date-picker
              v-model:value="formValue.dd_zulu"
              type="datetime"
              style="width: 100%"
            />
          </n-form-item-gi>
          <n-form-item-gi
            :span="10"
            label="Arrival Date (z)"
            path="arrival_date"
          >
            <n-date-picker
              v-model:value="formValue.arrival_date"
              type="datetime"
              style="width: 100%"
            />
          </n-form-item-gi>
          <n-form-item-gi
            :span="4"
            label="Mission Number"
            path="mission_number"
          >
            <n-input v-model:value="formValue.mission_number" />
          </n-form-item-gi>
          <n-form-item-gi :span="5" label="From" path="from">
            <n-input v-model:value="formValue.from" />
          </n-form-item-gi>
          <n-form-item-gi :span="5" label="To" path="to">
            <n-input v-model:value="formValue.to" />
          </n-form-item-gi>
          <n-form-item-gi :span="5" label="Airport" path="airport">
            <n-input v-model:value="formValue.airport" />
          </n-form-item-gi>
          <n-form-item-gi :span="5" label="Ground Time" path="gnd_time">
            <n-input v-model:value="formValue.gnd_time" />
          </n-form-item-gi>
          <n-form-item-gi :span="4" label="Dead Head" path="dh">
            <n-switch v-model:value="formValue.dh" />
          </n-form-item-gi>
        </n-grid>
        <n-button
          style="float: right"
          type="primary"
          @click="saveMission"
          :loading="loading"
        >
          Add Mission
        </n-button>
      </n-form>
    </n-card>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  NH1,
  NIcon,
  NCard,
  NForm,
  NFormItemGi,
  NInput,
  NDatePicker,
  NGrid,
  NSwitch,
  NButton,
  useNotification,
  useLoadingBar,
} from "naive-ui";
import { PencilOutline } from "@vicons/ionicons5";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default {
  setup() {
    const loadingBar = useLoadingBar();
    const notification = useNotification();
    const formRef = ref(null);
    const formValue = ref({});
    const loading = ref(false);

    onMounted(() => {
      setTimeout(() => {
        loadingBar.finish();
      }, 1000);
    });

    return {
      formRef,
      formValue,
      loading,
      notification,
      rules: {
        dd_zulu: [
          {
            required: true,
            message: "Please select a date",
            validator: (rule, value) => {
              if (value) {
                const date = dayjs(value);
                if (date.isValid()) return true;
              }
              return new Error("Please select a valid date.");
            },
          },
        ],
        arrival_date: [
          {
            required: true,
            message: "Please select a time",
            validator: (rule, value) => {
              if (value) {
                const time = dayjs(value, "HH:mm");

                if (time.isValid()) return true;
              }
              return new Error("Please select a valid time.");
            },
          },
        ],
      },
    };
  },
  methods: {
    saveMission() {
      this.loading = true;
      axios
        .post(`${process.env.VUE_APP_API}/saveLeg`, {
          ...this.formValue,
          dd_zulu: dayjs.utc(this.formValue.dd_zulu).toISOString(),
          arrival_date: dayjs.utc(this.formValue.arrival_date).toISOString(),
        })
        .then((data) => {
          const { id } = data.data;
          this.loading = false;
          this.notification.success({
            content: "Mission saved successfully.",
            duration: 5000,
          });

          setTimeout(() => this.$router.push(`/mission/${id}`), 1000);
        })
        .catch((error) => {
          this.notification.error({
            content: "An error occured",
            meta: error.response.data.message,
            duration: 5000,
          });
          this.loading = false;
        });
    },
  },
  components: {
    NH1,
    NIcon,
    NCard,
    NGrid,
    NForm,
    NFormItemGi,
    NDatePicker,
    NInput,
    PencilOutline,
    NSwitch,
    NButton,
  },
};
</script>