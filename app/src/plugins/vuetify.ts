import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: {
            customProperties: true,
        },
        themes: {
            light: {
                primary: "#2196f3",
                secondary: "#424242",
                accent: "#ff9800",
                error: "#ff5252",
                info: "#2196f3",
                success: "#4caf50",
                warning: "#ffc107",
            },
        },
    },
});
