// Simple i18n system for multilingual support
export type Language = "en" | "es" | "fr" | "yo"

export const translations = {
  en: {
    nav: {
      home: "Home",
      ourStory: "Our Story",
      details: "Details",
      gallery: "Gallery",
      guestGallery: "Guest Gallery",
      rsvp: "RSVP",
      wishes: "Wishes",
      contact: "Contact",
      status: "Status",
    },
    common: {
      loading: "Loading...",
      close: "Close",
      submit: "Submit",
      cancel: "Cancel",
      error: "Error",
      success: "Success",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      ourStory: "Nuestra Historia",
      details: "Detalles",
      gallery: "Galería",
      guestGallery: "Galería de Invitados",
      rsvp: "RSVP",
      wishes: "Deseos",
      contact: "Contacto",
      status: "Estado",
    },
    common: {
      loading: "Cargando...",
      close: "Cerrar",
      submit: "Enviar",
      cancel: "Cancelar",
      error: "Error",
      success: "Éxito",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      ourStory: "Notre Histoire",
      details: "Détails",
      gallery: "Galerie",
      guestGallery: "Galerie des Invités",
      rsvp: "RSVP",
      wishes: "Vœux",
      contact: "Contact",
      status: "Statut",
    },
    common: {
      loading: "Chargement...",
      close: "Fermer",
      submit: "Soumettre",
      cancel: "Annuler",
      error: "Erreur",
      success: "Succès",
    },
  },
  yo: {
    nav: {
      home: "Ilẹ̀",
      ourStory: "Itan Wa",
      details: "Ọkọ̀",
      gallery: "Gallery",
      guestGallery: "Gallery Àwọn Alákòọ̀",
      rsvp: "RSVP",
      wishes: "Àkọ̀lẹ",
      contact: "Ìkipín",
      status: "Ipo",
    },
    common: {
      loading: "Ń tẹ̀...",
      close: "Pa",
      submit: "Fi ránṣẹ",
      cancel: "Fagile",
      error: "Àsìṣe",
      success: "Ìmọ̀",
    },
  },
}

export const getTranslation = (language: Language, path: string) => {
  const keys = path.split(".")
  let value: any = translations[language]

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key]
    } else {
      return path
    }
  }

  return value || path
}
