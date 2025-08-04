<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "name-initials",
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "small",
    },
  },
  setup(props) {
    const initialLetters = computed(() => {
      if (props.name === undefined) {
        return "";
      }

      const rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

      const initials = [...props.name.matchAll(rgx)] || [];

      var partOneLetter = "";
      var partTwoLetter = "";

      var partOne = initials.shift();
      if (partOne) {
        partOneLetter = partOne[1];
      }

      var partTwo = initials.pop();
      if (partTwo) {
        partTwoLetter = partTwo[1];
      }

      return (
        partOneLetter.toString() + partTwoLetter.toString()
      ).toUpperCase();
    });

    const sizeClass = computed(() => {
      if (props.size == "small") return "small";
      if (props.size == "normal") return "normal";
      if (props.size == "large") return "large";

      return "";
    });

    return { initialLetters, sizeClass };
  },
});
</script>

<template>
  <div class="initials" :class="sizeClass">
    <span>{{ initialLetters }}</span>
  </div>
</template>

<style scoped>
.initials {
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
  background: #e6f8f3;
  color: #4ac087;
  margin-right: 10px;
  flex-shrink: 0;
}

.initials.small {
  height: 30px;
  width: 30px;
}

.initials.normal {
  height: 40px;
  width: 40px;
}

.initials.large {
  height: 50px;
  width: 50px;
}

.initials span {
  font-weight: 500;
}
</style>
