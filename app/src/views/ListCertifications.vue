<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-menu
          v-model="date_from_menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date_from"
              label="Fecha de inicio"
              append-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date_from" @input="date_from_menu = false"></v-date-picker>
        </v-menu>
        <v-menu
          v-model="time_from_menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="time_from"
              label="Hora de inicio"
              append-icon="mdi-clock"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker v-model="time_from" @input="time_from_menu = false"></v-time-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="6">
        <v-menu
          v-model="date_to_menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date_to"
              label="Fecha de fin"
              append-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date_to" @input="date_to_menu = false"></v-date-picker>
        </v-menu>
        <v-menu
          v-model="time_to_menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="time_to"
              label="Hora de inicio"
              append-icon="mdi-clock"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker v-model="time_to" @input="time_to_menu = false"></v-time-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedTechnician"
          :items="technicians"
          label="Técnico"
          item-text="name"
          item-value="id"
        ></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn @click="queryTasks" color="primary">Consultar Tareas</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="tasks" hide-default-footer>
          <template v-slot:item.date_completed="{ item }">
            {{ item.date_completed | formatDate }}
          </template>
          <template v-slot:item.subtotal="{ item }">
            {{ getSubtotal(item) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <p class="text-right"><strong>Total: {{ getTotal() }}</strong></p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        date_from: null,
        date_to: null,
        time_from: null,
        time_to: null,
        technicianId: null,
        technicians: [],
        selectedTechnician: null,
        tasks: [],
        headers: [
          { text: 'Grupo', value: 'group.description' },
          { text: 'Tarea', value: 'task.name' },
          { text: 'Cumplimiento', value: 'date_completed' },
          { text: 'Hora', value: 'hour' },
          { text: 'Conexión', value: 'conection' },
          { text: 'Observación', value: 'observation' },
          { text: 'Cantidad', value: 'quantity' },
          { text: 'Precio', value: 'task.prices[0].price' },
          { text: 'Subtotal', value: 'subtotal' }
        ]
      }
    },
    mounted() {
      this.fetchTechnicians()
      this.fetchCertifications()
    },
    methods: {
      getSubtotal(item) {
        return item.quantity * item.task.prices[0].price
      },
      getTotal() {
        return this.tasks.reduce((total, item) => total + this.getSubtotal(item), 0)
      },
      async fetchTechnicians() {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}api/technicians?size=1000`)
        this.technicians = response.data.technicians
      },
      async fetchCertifications() {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}api/group_tasks`)
        this.tasks = response.data
      },
      async queryTasks() {
        const data = {
          date_from: this.date_from,
          date_to: this.date_to,
          time_from: this.time_from,
          time_to: this.time_to,
          technicianId: this.selectedTechnician
        }

        try {
          const response = await axios.get(`${process.env.VUE_APP_API_URL}api/group_tasks`, data)
          this.tasks = response.data
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
</script>