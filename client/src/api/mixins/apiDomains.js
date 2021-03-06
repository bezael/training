import { api, genericErrorManagement } from '../helper'

export default {
  methods: {
    apiGetDomains(agentId) {
      return api.get(`agents/${agentId}/domains`)
        .catch(error => {
          if (error.status && error.status === 401) {
            return Promise.reject('API error: User not logged in')
          } else {
            return genericErrorManagement(error)
          }
        })
    },
    apiPostDomain(agentId, { name, language }) {
      return api.post(`agents/${agentId}/domains`, { name, language })
        .catch(error => {
          if (error.status) {
            switch (error.status) {
              case 400:
                return Promise.reject('API error: Agent name is mandatory')
              case 401:
                return Promise.reject('API error: User has no rights to modify this agent')
              case 409:
                return Promise.reject('API error: Domain with the same name already exists')
              default:
                return genericErrorManagement(error)
            }
          } else {
            return genericErrorManagement(error)
          }
        })
    },
    apiDeleteDomain(agentId, {domainId}) {
      return api.delete(`agents/${agentId}/domains/${domainId}`)
        .catch(error => {
          if (error.status && error.status === 401) {
            return Promise.reject('API error: User has no rights to modify this agent')
          } else {
            return genericErrorManagement(error)
          }
        })
    },
    apiPutDomain(agentId, { name, language, domainId }) {
      return api.put(`agents/${agentId}/domains/${domainId}`, {name, language})
        .catch(error => {
          if (error.status && error.status === 401) {
            return Promise.reject('API error: User has no rights to modify this agent')
          } else {
            return genericErrorManagement(error)
          }
        })
    }
  }
}