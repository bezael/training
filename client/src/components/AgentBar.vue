<template>
  <div class="has-background-primary wrapper">
    <div class="agent-management">
      <img class="agent-image" src="../assets/chatbot.svg" alt />
      <b-field class="agent-selector" v-show="agents.length > 0" aria-label="Agent selector" type="is-primary">
          <b-select placeholder="Select an agent" expanded @input="onSelectAgent" :value="$route.params.id">
              <option
                  v-for="agent in agents"
                  :value="agent._id"
                  :key="agent._id"
                  >
                  {{ agent.name }}
              </option>
          </b-select>
      </b-field>
      <b-button type="is-primary" inverted :outlined="agents.length > 0" icon-right="plus" @click="clickNewAgent">Create new agent</b-button>
    </div>
    <agent-menu v-if="$route.params.id"/>
    <dialog-base
      title="New agent"
      :error-message="errorMessage"
      :open="openNewAgentModal"
      @close="openNewAgentModal = false"
    >
          <new-agent-form @form-change="onFormChange"/>
          <div class="level">
            <b-button
              @click="clickSubmitAgent"
              type="is-primary"
              :disabled="!isValidForm"
            >
              Create
            </b-button>
          </div>
    </dialog-base>
  </div>
</template>
<script>
import apiAgent from '@/api/mixins/apiAgent';
import AgentMenu from './AgentMenu';

export default {
  name: "AgentBar",
  mixins: [apiAgent],
  components: {
    'new-agent-form': () => import(/* webpackChunkName: "extras" */'./NewAgentForm'),
    'agent-menu': AgentMenu,
    'dialog-base': () => import(/* webpackChunkName: "extras" */'./micro/DialogBase'),
  },
  data() {
    return {
      agents: [],
      openNewAgentModal: false,
      isValidForm: false,
      errorMessage: '',
      agentData: {}
    };
  },
  created() {
    this.apiGetAgents().then(result => (this.agents = result));
  },
  methods: {
    clickNewAgent() {
      this.openNewAgentModal = true;
    },
    clickSubmitAgent() {
      this.apiPostAgent(this.agentData)
        .then((newAgent) => {
          this.agents.push(newAgent)
          this.openNewAgentModal = false
          this.agentData = {}
        })
        .catch(error => {
          this.errorMessage = error
        })
    },
    onFormChange ({valid, data}) {
      this.errorMessage = ''
      this.isValidForm = valid
      if (valid) {
        this.agentData = data
      }
    },
    onSelectAgent(agentId) {
      this.$router.push({name: 'Agent', params: {id: agentId}})
    }
  },
};
</script>
<style scoped>
.wrapper {
  grid-area: agent;
  padding: 2rem 1rem 1rem;
}
.agent-management {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.agent-image {
  width: 100%;
  max-width: 150px;
  margin-bottom: 1rem;
}
.agent-selector {
  width: 100%;
  margin-top: 0.5rem;
}
.level {
  margin-top: 2em;
}
</style>