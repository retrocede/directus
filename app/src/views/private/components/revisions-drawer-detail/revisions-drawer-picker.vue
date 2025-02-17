<template>
	<v-menu show-arrow>
		<template #activator="{ toggle }">
			<span class="picker" @click="toggle">
				{{ selectedOption && selectedOption.text }}
				<v-icon name="expand_more" small />
			</span>
		</template>

		<v-list class="menu">
			<v-list-item
				v-for="option in options"
				:key="option.value"
				clickable
				:active="internalCurrent === option.value"
				@click="internalCurrent = option.value"
			>
				<v-icon name="commit_node" />
				<v-list-item-content>{{ option.text }}</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent, PropType, computed, watch, ref } from 'vue';
import { Revision } from './types';
import useSync from '@/composables/use-sync';
import localizedFormat from '@/utils/localized-format';
import { userName } from '@/utils/user-name';

type Option = {
	text: string;
	value: number;
};

export default defineComponent({
	props: {
		revisions: {
			type: Array as PropType<Revision[]>,
			required: true,
		},
		current: {
			type: Number,
			required: true,
		},
	},
	emits: ['update:current'],
	setup(props, { emit }) {
		const { t } = useI18n();

		const internalCurrent = useSync(props, 'current', emit);

		const options = ref<Option[] | null>(null);

		watch(
			() => props.revisions,
			async () => {
				const newOptions = [];

				for (const revision of props.revisions) {
					const date = await getFormattedDate(revision);
					let user = t('private_user');

					if (typeof revision.activity.user === 'object') {
						const userInfo = revision.activity.user;
						user = userName(userInfo);
					}

					const text = String(t('revision_delta_by', { date, user }));
					const value = revision.id;
					newOptions.push({ text, value });
				}

				options.value = newOptions;
			},
			{ immediate: true }
		);

		const selectedOption = computed(() => {
			return options.value?.find((option) => option.value === internalCurrent.value);
		});

		return { internalCurrent, options, selectedOption };

		async function getFormattedDate(revision: Revision) {
			const date = await localizedFormat(new Date(revision!.activity.timestamp), String(t('date-fns_date_short')));
			const time = await localizedFormat(new Date(revision!.activity.timestamp), String(t('date-fns_time')));

			return `${date} (${time})`;
		}
	},
});
</script>

<style lang="scss" scoped>
.picker {
	color: var(--foreground-subdued);
	cursor: pointer;
	transition: color var(--fast) var(--transition);

	&:hover {
		color: var(--foreground-normal);
	}
}

.menu {
	.v-icon {
		margin-right: 4px;
		margin-left: -4px;
		color: var(--foreground-subdued);
	}

	.v-list-item-content {
		margin-right: 20px;
	}
}
</style>
