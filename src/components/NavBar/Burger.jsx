import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Burger = (props, { t }) => (
  <div id="menu-burger" className="menu-burger">
    {/* <hr v-if="$store.state.user.info" class="dropdown-divider divider-burger">
    <nuxt-link v-if="$store.state.user.info" @click.native="closePopupBurger()" :to="'/builder/step-by-step'" class="button button-burger is-dark">
      <b-icon pack="fas" icon="paint-brush"></b-icon>
      <span class="sub-menu-button burger-menu-button has-text-grey-light">{{$t('navbar.builder.builder')}}</span>
      -
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.builder.step-by-step')}}</span>
    </nuxt-link>

    <nuxt-link v-if="$store.state.user.info" @click.native="closePopupBurger()" :to="'/builder/classic'" class="button button-burger is-dark">
      <b-icon pack="fas" icon="paint-brush"></b-icon>
      <span class="sub-menu-button burger-menu-button has-text-grey-light">{{$t('navbar.builder.builder')}}</span>
      -
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.builder.classic')}}</span>
    </nuxt-link>

    <hr class="dropdown-divider divider-burger">
    <nuxt-link @click.native="closePopupBurger()" :to="'/stats'" class="button button-burger is-dark">
      <b-icon icon="finance"></b-icon>
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.statistics')}}</span>
    </nuxt-link>

    <hr class="dropdown-divider divider-burger">
    <nuxt-link @click.native="closePopupBurger()" :to="'/donate'" class="button button-burger is-dark">
      <b-icon pack="fab" icon="bitcoin" type="is-warning"></b-icon>
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.donate')}}</span>
    </nuxt-link>

    <!-- <hr class="dropdown-divider divider-burger">
    <nuxt-link @click.native="closePopupBurger()" :to="'/faq'" class="button button-burger is-dark">
      <b-icon pack="far" icon="question-circle" type="is-lightblue"></b-icon>
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.faq')}}</span>
    </nuxt-link> -->

    <hr class="dropdown-divider divider-burger">
    <nuxt-link @click.native="closePopupBurger()" :to="'/about'" class="button button-burger is-dark">
      <b-icon pack="fas" icon="info-circle"></b-icon>
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.user.about')}}</span>
    </nuxt-link>

    <hr class="dropdown-divider divider-burger">
    <nuxt-link @click.native="closePopupBurger()" :to="'/contact'" class="button button-burger is-dark">
      <b-icon pack="fas" icon="envelope"></b-icon>
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.user.contact')}}</span>
    </nuxt-link>

    <hr v-if="$store.state.user.info" class="dropdown-divider divider-burger">
    <nuxt-link v-if="$store.state.user.info" @click.native="closePopupBurger()" :to="'/settings'" class="button button-burger is-dark">
      <b-icon pack="fas" icon="cog"></b-icon>
      <span class="sub-menu-button has-text-grey-lighter">{{$t('navbar.settings')}}</span>
    </nuxt-link>

    <hr class="dropdown-divider divider-burger">
    <div class="locale-links">
      <a class="locale-link" v-for="locale in $store.state.locales" :key="locale" @click="setLocale(locale)">
        <img class="locale-img" :src="getLocaleImagePath(locale)">
      </a>
    </div>

    <hr class="dropdown-divider divider-burger"> */}
  </div>
);

Burger.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Burger;
