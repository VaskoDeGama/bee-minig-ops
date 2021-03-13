<template>
  <b-form @submit.prevent="parseLog(logText)">
    <b-form-group>
      <b-form-textarea
          id="textarea"
          v-model="logText"
          placeholder="Enter fleet log"
          rows="10"
          max-rows="20"/>
    </b-form-group>

    <b-button type="submit" variant="primary">Parse</b-button>
    <b-button type="reset" variant="danger">Clear</b-button>
  </b-form>
</template>

<script>
export default {
  name: 'ParseForm',
  props: ['parseLog'],
  data () {
    return {
      logText: 'Time\tCharacter\tItem Type\tQuantity\tItem Group\n' +
          '2021.03.11 17:25\tKomon Okanata\t<localized hint="Arkonor">Arkonor*</localized>\t2814\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:26\tDiana Udan\t<localized hint="Arkonor">Arkonor*</localized>\t3167\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:24\tMina Cepesh\t<localized hint="Arkonor">Arkonor*</localized>\t12827\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:26\tznaxar Lemmont\t<localized hint="Arkonor">Arkonor*</localized>\t1200\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:26\tNIKOJIA SPIRTOVKIN\t<localized hint="Arkonor">Arkonor*</localized>\t3447\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:26\tAloxalola\t<localized hint="Arkonor">Arkonor*</localized>\t578\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:26\tHAnter33\t<localized hint="Arkonor">Arkonor*</localized>\t3026\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:26\tAlex Osfar\t<localized hint="Arkonor">Arkonor*</localized>\t744\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 16:38\tDiana Udan\t<localized hint="Gneiss">Gneiss*</localized>\t2981\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:36\tKomon Okanata\t<localized hint="Gneiss">Gneiss*</localized>\t2580\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:38\tAlex Osfar\t<localized hint="Gneiss">Gneiss*</localized>\t625\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:36\tAloxalola\t<localized hint="Gneiss">Gneiss*</localized>\t456\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:01\tVARATAY\t<localized hint="Neural Network Analyzer">Neural Network Analyzer*</localized>\t10\t<localized hint="Sleeper Components">Компоненты Sleeper*</localized>\t\n' +
          '2021.03.11 16:36\tznaxar Lemmont\t<localized hint="Gneiss">Gneiss*</localized>\t4642\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:26\tAlex Osfar\t<localized hint="Kernite">Kernite*</localized>\t11201\t<localized hint="Kernite">Kernite*</localized>\t\n' +
          '2021.03.11 16:26\tDiana Udan\t<localized hint="Kernite">Kernite*</localized>\t53000\t<localized hint="Kernite">Kernite*</localized>\t\n' +
          '2021.03.11 16:36\tNIKOJIA SPIRTOVKIN\t<localized hint="Gneiss">Gneiss*</localized>\t16172\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:26\tKomon Okanata\t<localized hint="Kernite">Kernite*</localized>\t45582\t<localized hint="Kernite">Kernite*</localized>\t\n' +
          '2021.03.11 16:26\tAloxalola\t<localized hint="Kernite">Kernite*</localized>\t8640\t<localized hint="Kernite">Kernite*</localized>\t\n' +
          '2021.03.11 15:40\tKomon Okanata\t<localized hint="Bistot">Bistot*</localized>\t2391\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 15:40\tNIKOJIA SPIRTOVKIN\t<localized hint="Bistot">Bistot*</localized>\t3002\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 16:35\tMina Cepesh\t<localized hint="Kernite">Kernite*</localized>\t200000\t<localized hint="Kernite">Kernite*</localized>\t\n' +
          '2021.03.11 16:48\tMina Cepesh\t<localized hint="Gneiss">Gneiss*</localized>\t29924\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:36\tHAnter33\t<localized hint="Gneiss">Gneiss*</localized>\t2544\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:26\tHAnter33\t<localized hint="Kernite">Kernite*</localized>\t77289\t<localized hint="Kernite">Kernite*</localized>\t\n' +
          '2021.03.11 14:03\tznaxar Lemmont\t<localized hint="Neural Network Analyzer">Neural Network Analyzer*</localized>\t4\t<localized hint="Sleeper Components">Компоненты Sleeper*</localized>\t\n' +
          '2021.03.11 14:02\tHAnter33\t<localized hint="Neural Network Analyzer">Neural Network Analyzer*</localized>\t6\t<localized hint="Sleeper Components">Компоненты Sleeper*</localized>\t\n' +
          '2021.03.11 16:29\tMina Cepesh\t<localized hint="Bistot">Bistot*</localized>\t23845\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 15:40\tznaxar Lemmont\t<localized hint="Bistot">Bistot*</localized>\t4067\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 15:40\tDiana Udan\t<localized hint="Bistot">Bistot*</localized>\t9071\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 14:53\tHAnter33\t<localized hint="Bistot">Bistot*</localized>\t3452\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 15:40\tAlex Osfar\t<localized hint="Bistot">Bistot*</localized>\t1376\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 15:40\tAloxalola\t<localized hint="Bistot">Bistot*</localized>\t1380\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '\n'

    }
  }
}
</script>

<style scoped>

</style>
