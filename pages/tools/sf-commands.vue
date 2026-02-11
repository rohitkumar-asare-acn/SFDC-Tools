<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import CopyIcon from '../../components/icons/CopyIcon.vue';
import ResetIcon from '../../components/icons/ResetIcon.vue';
import { Codemirror } from 'vue-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from 'codemirror';
import { storageManager, type Environment } from '../../utils/storageManager';


useSeoMeta({
    title: 'SF CLI Commands Cheat Sheet',
    ogTitle: 'SF CLI Commands Cheat Sheet',
    description: 'SF CLI Commands Cheat Sheet provides quick access to common Salesforce CLI commands.',
    ogDescription: 'SF CLI Commands Cheat Sheet provides quick access to common Salesforce CLI commands.',
});

// Codemirror setup
const extensions = [oneDark, EditorView.lineWrapping];
const view = shallowRef();
const handleReady = (payload: any) => {
    view.value = payload.view;
};

// State management
const environments = ref<Environment[]>([]);
const showEnvModal = ref(false);
const activeTab = ref<'deploy' | 'apex'>('deploy');
const envFormState = reactive({
    alias: '',
    editingId: null as string | null
});

// Environment variables and test classes
const testClassesInput = ref("");
const selectedEnv = ref("");
const deployValidateOutput = ref("");
const apexTestOutput = ref("");

onMounted(() => {
    loadEnvironments();
});

const loadEnvironments = () => {
    environments.value = storageManager.getEnvironments();
};

// Watch for changes in test classes to auto-generate commands
watch(testClassesInput, () => {
    if (activeTab.value === 'deploy') {
        generateDeployValidateCommand();
    } else {
        generateApexRunTest();
    }
});

// Watch for selected env change
watch(selectedEnv, () => {
    if (activeTab.value === 'deploy') {
        generateDeployValidateCommand();
    }
});

// Watch for tab change to regenerate command for the active tab
watch(activeTab, () => {
    if (activeTab.value === 'deploy') {
        generateDeployValidateCommand();
    } else {
        generateApexRunTest();
    }
});

const openEnvModal = (env?: Environment) => {
    if (env) {
        envFormState.alias = env.alias;
        envFormState.editingId = env.id;
    } else {
        envFormState.alias = '';
        envFormState.editingId = null;
    }
    showEnvModal.value = true;
};

const closeEnvModal = () => {
    showEnvModal.value = false;
    envFormState.alias = '';
    envFormState.editingId = null;
};

const saveEnvironment = () => {
    if (!envFormState.alias.trim()) {
        alert('Please enter an environment alias');
        return;
    }

    if (envFormState.editingId) {
        storageManager.updateEnvironment(envFormState.editingId, envFormState.alias);
    } else {
        storageManager.addEnvironment(envFormState.alias);
    }

    loadEnvironments();
    closeEnvModal();
};

const deleteEnvironment = (id: string) => {
    if (confirm('Are you sure you want to delete this environment?')) {
        storageManager.deleteEnvironment(id);
        if (selectedEnv.value === id) {
            selectedEnv.value = '';
        }
        loadEnvironments();
    }
};

// Command builders - auto-triggered
const generateDeployValidateCommand = () => {
    if (!selectedEnv.value || !testClassesInput.value.trim()) {
        deployValidateOutput.value = '';
        return;
    }

    const testClassesArray = testClassesInput.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(className => `--tests "${className}"`);

    if (testClassesArray.length === 0) {
        deployValidateOutput.value = '';
        return;
    }

    const testClassesStr = testClassesArray.join(' ');
    const selectedEnvAlias = environments.value.find(e => e.id === selectedEnv.value)?.alias || selectedEnv.value;

    deployValidateOutput.value = `sf project deploy validate --manifest manifest/package.xml --target-org ${selectedEnvAlias} --test-level RunSpecifiedTests ${testClassesStr}`;
};

const generateApexRunTest = () => {
    if (!testClassesInput.value.trim()) {
        apexTestOutput.value = '';
        return;
    }

    const testClasses = testClassesInput.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(className => `--class-names "${className}"`)
        .join(' ');

    if (!testClasses) {
        apexTestOutput.value = '';
        return;
    }

    apexTestOutput.value = `sf apex run test ${testClasses} --result-format human --synchronous`;
};

const copyToClipboard = async (text: string, showToast = true) => {
    try {
        await navigator.clipboard.writeText(text);
        if (showToast) {
            addToast('Command copied to clipboard!', 'Success');
            console.log('Copied to clipboard!');
        }
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};

const staticCommand = ref("sf code-analyzer run --rule-selector pmd --output-file pmd_results.html");

const clearTestClasses = () => {
    testClassesInput.value = '';
};
</script>

<template>
    <!-- Header -->
    <div class="mb-8">
        <PageTitle class="text-3xl font-bold mb-2">SF CLI Commands Cheat Sheet</PageTitle>
        <InputLabel class="text-base font-light text-gray-600 dark:text-gray-300">
            Salesforce CLI Commands to Validate Package.xml / Run Tests with Environment Management
        </InputLabel>
    </div>

    <!-- Environment Variables Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border p-6 mb-8">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Environment Variables</h2>
            <button @click="openEnvModal()"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 font-medium">
                + Add Environment
            </button>
        </div>

        <div v-if="environments.length === 0" class="text-gray-500 dark:text-gray-400 py-6 text-center">
            No environments configured yet. Add one to get started.
        </div>

        <div v-else class="overflow-y-auto max-h-80">
            <table class="w-full">
                <thead class="bg-gray-100 dark:bg-gray-700 sticky top-0">
                    <tr>
                        <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Alias</th>
                        <th class="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="env in environments" :key="env.id"
                        class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td class="px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-100">{{ env.alias }}</td>
                        <td class="px-4 py-3 text-right space-x-2">
                            <button @click="openEnvModal(env)"
                                class="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded transition-colors duration-200">
                                Edit
                            </button>
                            <button @click="deleteEnvironment(env.id)"
                                class="px-3 py-1 text-xs bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-200 rounded transition-colors duration-200">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Static Command Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Code Analyzer Command</h2>
        <div class="flex my-4 justify-start items-center">

            <div
                class="bg-gray-900 dark:bg-gray-950 text-green-400 p-3 rounded-lg font-mono text-sm overflow-x-auto mr-4">
                {{ staticCommand }}
            </div>

            <SVGIconButton @click="copyToClipboard(staticCommand, true)" :icon="CopyIcon" :isSquare="false"
                color="green" title="Copy Command" />

            <!-- <button
                @click="copyToClipboard(staticCommand, true)"
                class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 font-medium flex items-center gap-2"
            >
                <CopyIcon class="w-4 h-4" />
                Copy Command
            </button> -->
        </div>
    </div>

    <!-- Command Builders Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <!-- Tabs and Environment Selector -->
        <div class="flex items-end justify-between gap-4 mb-2 pb-4 dark:border-gray-700">
            <!-- Tabs -->
            <div class="flex gap-4">
                <button @click="activeTab = 'deploy'" :class="[
                    'px-4 py-2 font-medium transition-colors duration-200 border-b-2',
                    activeTab === 'deploy'
                        ? 'text-blue-600 dark:text-blue-400 border-blue-600'
                        : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
                ]">
                    Validate Package
                </button>
                <button @click="activeTab = 'apex'" :class="[
                    'px-4 py-2 font-medium transition-colors duration-200 border-b-2',
                    activeTab === 'apex'
                        ? 'text-blue-600 dark:text-blue-400 border-blue-600'
                        : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
                ]">
                    Apex Run Test
                </button>
            </div>

            <!-- Environment Selector (only for deploy tab) -->
            <div class="w-64">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Environment
                </label>
                <select v-model="selectedEnv"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Select Environment --</option>
                    <option v-for="env in environments" :key="env.id" :value="env.id">
                        {{ env.alias }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Single Test Classes Input -->
        <div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Test Classes (one per line)
                </label>
                <codemirror v-model="testClassesInput" placeholder="TestClass1&#10;TestClass2&#10;TestClass3"
                    :style="{ height: '150px', borderRadius: '5px', overflow: 'hidden' }" :autofocus="false"
                    :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="handleReady" />
            </div>

            <!-- Output Command (Deploy Validate) -->
            <div v-if="activeTab === 'deploy' && deployValidateOutput" class="my-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Generated Command
                </label>
                <div
                    class="bg-gray-900 dark:bg-gray-950 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto break-words whitespace-pre-wrap">
                    {{ deployValidateOutput }}
                </div>
            </div>

            <!-- Output Command (Apex Run Test) -->
            <div v-if="activeTab === 'apex' && apexTestOutput">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Generated Command
                </label>
                <div
                    class="bg-gray-900 dark:bg-gray-950 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto break-words whitespace-pre-wrap">
                    {{ apexTestOutput }}
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 my-4" v-if="deployValidateOutput || apexTestOutput">

                <PrimaryButton
                    @click="copyToClipboard(activeTab === 'deploy' ? deployValidateOutput : apexTestOutput, true)">
                    Copy Command
                </PrimaryButton>

                <SVGIconButton @click="clearTestClasses" :icon="ResetIcon" :isSquare="false" color="red"
                    title="Reset Data" class="mr-4" />
            </div>
        </div>
    </div>

    <!-- Environment Modal -->
    <div v-if="showEnvModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {{ envFormState.editingId ? 'Edit Environment' : 'Add Environment' }}
            </h3>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Environment Alias
                    </label>
                    <input v-model="envFormState.alias" type="text" placeholder="e.g., nibs_dev"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>

            <div class="flex gap-3 mt-6">
                <button @click="saveEnvironment"
                    class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 font-medium">
                    Save
                </button>
                <button @click="closeEnvModal"
                    class="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-md transition-colors duration-200 font-medium">
                    Cancel
                </button>
            </div>
        </div>
    </div>

</template>
