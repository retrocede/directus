<template>
	<v-dialog v-model="internalActive" :persistent="persistent" placement="right" @esc="$emit('cancel')">
		<template #activator="{ on }">
			<slot name="activator" v-bind="{ on }" />
		</template>

		<article class="v-drawer">
			<v-button
				v-if="cancelable"
				v-tooltip.bottom="t('cancel')"
				class="cancel"
				icon
				rounded
				secondary
				@click="$emit('cancel')"
			>
				<v-icon name="close" />
			</v-button>

			<div class="content">
				<v-overlay v-if="$slots.sidebar" absolute @click="sidebarActive = false" />
				<nav v-if="$slots.sidebar" class="sidebar">
					<slot name="sidebar" />
				</nav>
				<main ref="mainEl" class="main">
					<header-bar :title="title" primary-action-icon="close" @primary="$emit('cancel')">
						<template #title><slot name="title" /></template>
						<template #headline>
							<slot name="subtitle">
								<p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
							</slot>
						</template>

						<template #title-outer:prepend>
							<slot name="title-outer:prepend">
								<v-button class="header-icon" rounded icon secondary disabled>
									<v-icon :name="icon" />
								</v-button>
							</slot>
						</template>

						<template #actions:prepend><slot name="actions:prepend" /></template>
						<template #actions><slot name="actions" /></template>

						<template #title:append><slot name="header:append" /></template>
					</header-bar>

					<v-detail v-if="$slots.sidebar" class="mobile-sidebar" :label="sidebarLabel">
						<nav>
							<slot name="sidebar" />
						</nav>
					</v-detail>

					<slot />
				</main>
			</div>
		</article>
	</v-dialog>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent, ref, computed, provide } from 'vue';
import HeaderBar from '@/views/private/components/header-bar/header-bar.vue';
import { i18n } from '@/lang';

export default defineComponent({
	components: {
		HeaderBar,
	},
	props: {
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			default: null,
		},
		modelValue: {
			type: Boolean,
			default: undefined,
		},
		persistent: {
			type: Boolean,
			default: false,
		},
		icon: {
			type: String,
			default: 'box',
		},
		sidebarLabel: {
			type: String,
			default: i18n.global.t('sidebar'),
		},
		cancelable: {
			type: Boolean,
			default: true,
		},
	},
	emits: ['cancel', 'update:modelValue'],
	setup(props, { emit }) {
		const { t } = useI18n();

		const localActive = ref(false);

		const mainEl = ref<Element>();

		provide('main-element', mainEl);

		const internalActive = computed({
			get() {
				return props.modelValue === undefined ? localActive.value : props.modelValue;
			},
			set(newActive: boolean) {
				localActive.value = newActive;
				emit('update:modelValue', newActive);
			},
		});

		return { t, internalActive, mainEl };
	},
});
</script>

<style>
body {
	--v-drawer-max-width: 856px;
}
</style>

<style lang="scss" scoped>
.v-drawer {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: var(--v-drawer-max-width);
	height: 100%;
	background-color: var(--background-page);

	.cancel {
		position: absolute;
		top: 32px;
		left: -76px;
	}

	.spacer {
		flex-grow: 1;
	}

	.header-icon {
		--v-button-background-color: var(--background-normal);
		--v-button-background-color-active: var(--background-normal);
		--v-button-background-color-hover: var(--background-normal-alt);
		--v-button-color-disabled: var(--foreground-normal);
	}

	.content {
		--border-radius: 6px;
		--input-height: 60px;
		--input-padding: 16px; // (60 - 4 - 24) / 2
		--form-vertical-gap: 52px;

		position: relative;
		display: flex;
		flex-grow: 1;
		overflow: hidden;

		// Page Content Spacing (Could be converted to Project Setting toggle)
		font-size: 15px;
		line-height: 24px;

		.sidebar {
			--v-list-item-background-color-hover: var(--background-normal-alt);
			--v-list-item-background-color-active: var(--background-normal-alt);

			display: none;

			@media (min-width: 960px) {
				position: relative;
				z-index: 2;
				display: block;
				flex-basis: 220px;
				flex-shrink: 0;
				width: 220px;
				height: 100%;
				height: auto;
				background-color: var(--background-normal);
			}
		}

		.v-overlay {
			--v-overlay-z-index: 1;

			@media (min-width: 960px) {
				--v-overlay-z-index: none;

				display: none;
			}
		}

		.main {
			--content-padding: 16px;
			--content-padding-bottom: 32px;

			flex-grow: 1;
			overflow: auto;

			@media (min-width: 600px) {
				--content-padding: 32px;
				--content-padding-bottom: 132px;
			}
		}
	}

	@media (min-width: 960px) {
		width: calc(100% - 64px);
	}
}

.mobile-sidebar {
	margin: var(--content-padding);

	nav {
		background-color: var(--background-subdued);
		border-radius: var(--border-radius);
	}

	@media (min-width: 960px) {
		display: none;
	}
}
</style>
