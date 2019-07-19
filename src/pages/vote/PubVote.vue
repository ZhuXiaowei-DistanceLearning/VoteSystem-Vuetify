<template>
  <v-app>
    <v-card>
      <v-card-text>
        <vote-form></vote-form>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
  import VoteForm from './VoteForm'

  export default {
    name: "PubVote",
    components: {
      VoteForm
    }
  }
</script>

<style scoped>

</style>
