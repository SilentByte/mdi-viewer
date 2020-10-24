<!--
    MARKSMEN ONLINE PLATFORM
    Copyright (c) 2020 by MARKSMEN <https://marksmen.ch/>
-->

<!--suppress JSUnresolvedVariable, HtmlUnknownTarget -->
<template>
    <v-app>
        <v-app-bar dark app
                   class="pe-3 align-center justify-center"
                   color="primary">

            <v-toolbar-title class="me-6 text-uppercase">
                <span class="font-weight-bold">MDI</span><span class="font-weight-light">Viewer</span>
            </v-toolbar-title>

            <v-text-field light solo hide-details
                          autofocus clearable
                          prepend-inner-icon="mdi-magnify"
                          placeholder="Search…"
                          v-model="search"
                          @keydown.esc.stop="search = null" />
        </v-app-bar>
        <v-main v-resize="onResize">
            <v-virtual-scroll bench="10"
                              :items="rows"
                              :item-height="80"
                              :height="height"
            >
                <template v-slot:default="{ item }">
                    <v-container>
                        <v-row>
                            <v-col v-for="icon in item" :key="icon.n"
                                   class="text-center"
                            >
                                <v-btn large icon
                                       color="primary"
                                       :title="icon.n">
                                    <v-avatar tile size="30">
                                        <v-img :src="`mdi/${icon.n}.svg`"
                                               :alt="icon.n" />
                                    </v-avatar>
                                </v-btn>
                                <div style="font-size: 8px"
                                     :title="icon.n">
                                    {{ icon.n }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </template>
            </v-virtual-scroll>
        </v-main>
    </v-app>
</template>

<script lang="ts">

import chunk from "lodash/chunk";
import Fuse from "fuse.js";

import {
    Component,
    Vue,
} from "vue-property-decorator";

import * as MDI_META from "@/mdi-meta.gen.json";

const ICONS = MDI_META.slice();
const fuse = new Fuse(ICONS, {
    shouldSort: true,
    keys: ["n", "a", "t"],
});

@Component
export default class App extends Vue {
    private search: string | null = null;

    private height = 300;

    private get filteredIcons() {
        if(!this.search) {
            return ICONS;
        }

        return fuse.search(this.search, {limit: 80}).map(r => r.item);
    }

    private get rows() {
        const size = this.$vuetify.breakpoint.smAndDown ? 4 : 8;
        return chunk(this.filteredIcons, size);
    }

    private onResize() {
        this.height = window.innerHeight - 64;
    }
}

</script>

<style lang="scss">

html {
    overflow-y: auto !important;
}

</style>
