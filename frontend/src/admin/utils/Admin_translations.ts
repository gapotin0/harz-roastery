export type AdminLanguage = "en" | "uk";

export const adminTranslations = {
  en: {
    login: {
      title: "HARZ Admin",

      description:
        "Sign in to manage products, courses, course enrollments, orders and custom roasting requests.",

      login: "Login",
      password: "Password",

      signIn: "Sign in",

      error: "Incorrect login or password.",
    },

    sidebar: {
      dashboard: "Dashboard",
      products: "Products",
      orders: "Orders",
      courses: "Courses",
      courseEnrollments: "Course Enrollments",
      customRoasting: "Custom Roasting",

      logout: "Log out",
    },

    telegram: {
      sent: "Sent to Telegram",
      failed: "Not sent to Telegram",
      pending: "Sending to Telegram",
      missing: "Not sent to Telegram",
      resend: "Send again",
      sending: "Sending...",
    },

    dashboard: {
      title: "Dashboard",

      description: "Overview of HARZ Roastery.",

      products: "Products",
      orders: "Orders",
      courses: "Courses",
      courseEnrollments: "Course Enrollments",
      roastingRequests: "Roasting Requests",
    },

    products: {
      title: "Products",

      description: "Manage coffee products, prices and roast profiles.",

      count: "products",

      countOne: "product",
      countFew: "products",
      countMany: "products",

      searchPlaceholder: "Search products...",

      reset: "Reset products",
      add: "Add product",

      edit: "Edit",
      delete: "Delete",

      product: "Product",
      actions: "Actions",

      name: "Name",
      roast: "Roast",
      weight: "Weight",
      price: "Price",
      category: "Category",
      stock: "Stock",
      popularity: "Popularity",
      image: "Image",
      descriptionLabel: "Description",
      availability: "Availability",

      productImage: "Product image",
      imagePreview: "Product preview",
      uploadImage: "Upload image",
      changeImage: "Change image",
      editImage: "Edit image",
      removeImage: "Remove",

      invalidImageFile: "Please select an image file.",
      imageTooLarge: "Image must be smaller than 10 MB.",

      inStock: "In stock",
      outOfStock: "Out of stock",

      save: "Save product",
      saveChanges: "Save changes",
      cancel: "Cancel",

      addTitle: "Add product",
      editTitle: "Edit product",

      deleteConfirm: "Delete this product?",
      resetConfirm: "Reset all products to default values?",

      sort: {
        nameAsc: "Name: A–Z",
        nameDesc: "Name: Z–A",
        priceLow: "Price: Low to High",
        priceHigh: "Price: High to Low",
        popularity: "Popularity",
      },

      categories: {
        singleOrigin: "Single Origin",
        espresso: "Espresso",
        rare: "Rare",
        decaf: "Decaf",
      },

      roastLevels: {
        light: "Light Roast",
        medium: "Medium Roast",
        dark: "Dark Roast",
      },

      empty: {
        title: "No products found",

        description: "Try changing the search or filters.",
      },

      pagination: {
        previous: "Previous page",
        next: "Next page",
      },

      imageEditor: {
        title: "Edit image",
        close: "Close editor",
        zoom: "Zoom",
        rotate: "Rotate",
        cancel: "Cancel",
        processing: "Processing...",
        apply: "Apply image",
      },
    },

    orders: {
      title: "Orders",

      description: "View and manage customer orders.",

      countOne: "order",
      countFew: "orders",
      countMany: "orders",

      order: "Order",
      customer: "Customer",
      items: "Items",
      total: "Total",

      name: "Name",
      phone: "Phone",
      email: "Email",
      city: "City",
      address: "Address",
      comment: "Comment",

      quantity: "Quantity",
      price: "Price",

      delete: "Delete",

      deleteConfirm: "Delete this order?",

      status: {
        new: "New",
        processing: "Processing",
        shipped: "Shipped",
        completed: "Completed",
        cancelled: "Cancelled",
      },

      empty: {
        title: "No orders yet",

        description: "New customer orders will appear here.",
      },
    },

    courses: {
      title: "Courses",

      description: "Manage academy courses and content.",

      count: "courses",

      countOne: "course",
      countFew: "courses",
      countMany: "courses",

      searchPlaceholder: "Search courses...",

      reset: "Reset courses",
      add: "Add course",

      showInactive: "Show inactive",

      active: "Active",
      inactive: "Inactive",

      setActive: "Set active",
      setInactive: "Set inactive",

      edit: "Edit",
      delete: "Delete",

      duration: "Duration",
      price: "Price",

      ukrainian: "Ukrainian",
      english: "English",

      titleLabel: "Title",
      descriptionLabel: "Description",
      durationLabel: "Duration",

      durationPlaceholderUk: "Наприклад: 2 дні",
      durationPlaceholderEn: "Example: 2 days",

      settings: "Settings",

      activeCourse: "Course active",

      save: "Save course",
      cancel: "Cancel",

      addTitle: "Add course",
      editTitle: "Edit course",

      translate: "Translate Ukrainian → English",

      translating: "Translating...",

      translationUnavailable: "Translation service is not connected yet.",

      deleteConfirm: "Delete this course?",

      resetConfirm: "Reset all courses to default values?",

      modalDescription:
        "Manage the Ukrainian and English versions of the course.",

      close: "Close",

      translationFailed: "Translation failed. Please try again.",

      sort: {
        titleAsc: "Title: A–Z",
        titleDesc: "Title: Z–A",
        priceLow: "Price: Low to High",
        priceHigh: "Price: High to Low",
        activeFirst: "Active first",
      },

      empty: {
        title: "No courses found",

        description: "Try changing the search or filters, or add a new course.",
      },

      pagination: {
        previous: "Previous page",
        next: "Next page",
      },
    },

    enrollments: {
      title: "Course Enrollments",

      description: "View and manage customer course enrollment requests.",

      enrollment: "Enrollment",

      customer: "Customer",
      courseDetails: "Course details",

      name: "Name",
      email: "Email",
      phone: "Phone",

      courseId: "Course ID",
      duration: "Duration",
      price: "Price",

      delete: "Delete",

      deleteConfirm: "Delete this course enrollment?",

      status: {
        new: "New",
        contacted: "Contacted",
        confirmed: "Confirmed",
        completed: "Completed",
        cancelled: "Cancelled",
      },

      empty: {
        title: "No course enrollments yet",

        description:
          "New course enrollment requests from the website will appear here.",
      },
    },

    roasting: {
      title: "Custom Roasting",

      description: "View and manage custom roasting requests.",

      request: "Request",

      customer: "Customer",

      roastingDetails: "Roasting details",

      name: "Name",
      email: "Email",
      phone: "Phone",

      coffeeOrigin: "Coffee origin",
      quantity: "Quantity",
      roastLevel: "Roast level",
      purpose: "Purpose",

      additionalInformation: "Additional information",

      delete: "Delete",

      deleteConfirm: "Delete this custom roasting request?",

      status: {
        new: "New",
        contacted: "Contacted",
        inProgress: "In progress",
        completed: "Completed",
        cancelled: "Cancelled",
      },

      roastLevels: {
        light: "Light",
        medium: "Medium",
        dark: "Dark",
        notSure: "Not sure",
      },

      purposes: {
        filter: "Filter",
        espresso: "Espresso",
        omni: "Omni",
        other: "Other",
      },

      empty: {
        title: "No custom roasting requests yet",

        description: "New requests from the website will appear here.",
      },
    },
  },

  uk: {
    login: {
      title: "HARZ Admin",

      description:
        "Увійдіть, щоб керувати товарами, курсами, заявками на курси, замовленнями та запитами на індивідуальне обсмажування.",

      login: "Логін",
      password: "Пароль",

      signIn: "Увійти",

      error: "Неправильний логін або пароль.",
    },

    sidebar: {
      dashboard: "Панель",
      products: "Товари",
      orders: "Замовлення",
      courses: "Курси",
      courseEnrollments: "Заявки на курси",
      customRoasting: "Індивідуальне обсмажування",

      logout: "Вийти",
    },

    telegram: {
      sent: "Надіслано в Telegram",
      failed: "Не надіслано в Telegram",
      pending: "Надсилання в Telegram",
      missing: "Не надіслано в Telegram",
      resend: "Надіслати ще раз",
      sending: "Надсилання...",
    },

    dashboard: {
      title: "Панель керування",

      description: "Огляд HARZ Roastery.",

      products: "Товари",
      orders: "Замовлення",
      courses: "Курси",
      courseEnrollments: "Заявки на курси",
      roastingRequests: "Заявки на обсмажування",
    },

    products: {
      title: "Товари",

      description: "Керуйте товарами, цінами та профілями обсмажування.",

      count: "товарів",

      countOne: "товар",
      countFew: "товари",
      countMany: "товарів",

      searchPlaceholder: "Пошук товарів...",

      reset: "Скинути товари",
      add: "Додати товар",

      edit: "Редагувати",
      delete: "Видалити",

      product: "Товар",
      actions: "Дії",

      name: "Назва",
      roast: "Обсмажування",
      weight: "Вага",
      price: "Ціна",
      category: "Категорія",
      stock: "Наявність",
      popularity: "Популярність",
      image: "Зображення",
      descriptionLabel: "Опис",
      availability: "Наявність",

      productImage: "Зображення товару",
      imagePreview: "Попередній перегляд товару",
      uploadImage: "Завантажити зображення",
      changeImage: "Змінити зображення",
      editImage: "Редагувати зображення",
      removeImage: "Видалити",

      invalidImageFile: "Виберіть файл зображення.",
      imageTooLarge: "Розмір зображення має бути меншим за 10 МБ.",

      inStock: "В наявності",
      outOfStock: "Немає в наявності",

      save: "Зберегти товар",
      saveChanges: "Зберегти зміни",
      cancel: "Скасувати",

      addTitle: "Додати товар",
      editTitle: "Редагувати товар",

      deleteConfirm: "Видалити цей товар?",

      resetConfirm: "Скинути всі товари до початкових значень?",

      sort: {
        nameAsc: "Назва: А–Я",
        nameDesc: "Назва: Я–А",
        priceLow: "Ціна: від нижчої до вищої",
        priceHigh: "Ціна: від вищої до нижчої",
        popularity: "Популярність",
      },

      categories: {
        singleOrigin: "Моносорт",
        espresso: "Еспресо",
        rare: "Рідкісна кава",
        decaf: "Без кофеїну",
      },

      roastLevels: {
        light: "Світле обсмажування",
        medium: "Середнє обсмажування",
        dark: "Темне обсмажування",
      },

      empty: {
        title: "Товарів не знайдено",

        description: "Спробуйте змінити пошук або фільтри.",
      },

      pagination: {
        previous: "Попередня сторінка",
        next: "Наступна сторінка",
      },

      imageEditor: {
        title: "Редагування зображення",
        close: "Закрити редактор",
        zoom: "Масштаб",
        rotate: "Поворот",
        cancel: "Скасувати",
        processing: "Обробка...",
        apply: "Застосувати зображення",
      },
    },

    orders: {
      title: "Замовлення",

      description: "Переглядайте та керуйте замовленнями клієнтів.",

      countOne: "замовлення",
      countFew: "замовлення",
      countMany: "замовлень",

      order: "Замовлення",
      customer: "Клієнт",
      items: "Товари",
      total: "Разом",

      name: "Ім’я",
      phone: "Телефон",
      email: "Email",
      city: "Місто",
      address: "Адреса",
      comment: "Коментар",

      quantity: "Кількість",
      price: "Ціна",

      delete: "Видалити",

      deleteConfirm: "Видалити це замовлення?",

      status: {
        new: "Нове",
        processing: "Обробляється",
        shipped: "Відправлено",
        completed: "Виконано",
        cancelled: "Скасовано",
      },

      empty: {
        title: "Замовлень поки немає",

        description: "Нові замовлення клієнтів з’являться тут.",
      },
    },

    courses: {
      title: "Курси",

      description: "Керуйте курсами академії та їхнім вмістом.",

      count: "курсів",

      countOne: "курс",
      countFew: "курси",
      countMany: "курсів",

      searchPlaceholder: "Пошук курсів...",

      reset: "Скинути курси",
      add: "Додати курс",

      showInactive: "Показувати неактивні",

      active: "Активний",
      inactive: "Неактивний",

      setActive: "Зробити активним",

      setInactive: "Зробити неактивним",

      edit: "Редагувати",
      delete: "Видалити",

      duration: "Тривалість",
      price: "Ціна",

      ukrainian: "Українська",
      english: "Англійська",

      titleLabel: "Назва",
      descriptionLabel: "Опис",
      durationLabel: "Тривалість",

      durationPlaceholderUk: "Наприклад: 2 дні",
      durationPlaceholderEn: "Example: 2 days",

      settings: "Налаштування",

      activeCourse: "Курс активний",

      save: "Зберегти курс",
      cancel: "Скасувати",

      addTitle: "Додати курс",
      editTitle: "Редагувати курс",

      translate: "Перекласти з української → англійською",

      translating: "Переклад...",

      translationUnavailable: "Сервіс перекладу ще не підключено.",

      deleteConfirm: "Видалити цей курс?",

      resetConfirm: "Скинути всі курси до початкових значень?",

      modalDescription: "Керуйте українською та англійською версіями курсу.",

      close: "Закрити",

      translationFailed: "Не вдалося виконати переклад. Спробуйте ще раз.",

      sort: {
        titleAsc: "Назва: А–Я",
        titleDesc: "Назва: Я–А",
        priceLow: "Ціна: від нижчої до вищої",
        priceHigh: "Ціна: від вищої до нижчої",
        activeFirst: "Спочатку активні",
      },

      empty: {
        title: "Курсів не знайдено",

        description:
          "Спробуйте змінити пошук або фільтри чи додайте новий курс.",
      },

      pagination: {
        previous: "Попередня сторінка",
        next: "Наступна сторінка",
      },
    },

    enrollments: {
      title: "Заявки на курси",

      description: "Переглядайте та керуйте заявками клієнтів на курси.",

      enrollment: "Заявка",

      customer: "Клієнт",
      courseDetails: "Інформація про курс",

      name: "Ім’я",
      email: "Email",
      phone: "Телефон",

      courseId: "ID курсу",
      duration: "Тривалість",
      price: "Ціна",

      delete: "Видалити",

      deleteConfirm: "Видалити цю заявку на курс?",

      status: {
        new: "Нова",
        contacted: "Зв’язалися",
        confirmed: "Підтверджена",
        completed: "Завершена",
        cancelled: "Скасована",
      },

      empty: {
        title: "Заявок на курси поки немає",

        description: "Нові заявки на курси із сайту з’являться тут.",
      },
    },

    roasting: {
      title: "Індивідуальне обсмажування",

      description:
        "Переглядайте та керуйте заявками на індивідуальне обсмажування.",

      request: "Заявка",

      customer: "Клієнт",

      roastingDetails: "Параметри обсмажування",

      name: "Ім’я",
      email: "Email",
      phone: "Телефон",

      coffeeOrigin: "Походження кави",

      quantity: "Кількість",

      roastLevel: "Рівень обсмажування",

      purpose: "Призначення",

      additionalInformation: "Додаткова інформація",

      delete: "Видалити",

      deleteConfirm: "Видалити цю заявку на індивідуальне обсмажування?",

      status: {
        new: "Нова",
        contacted: "Зв’язалися",
        inProgress: "У роботі",
        completed: "Завершена",
        cancelled: "Скасована",
      },

      roastLevels: {
        light: "Світле",
        medium: "Середнє",
        dark: "Темне",
        notSure: "Не впевнений",
      },

      purposes: {
        filter: "Фільтр",
        espresso: "Еспресо",
        omni: "Омні",
        other: "Інше",
      },

      empty: {
        title: "Заявок на обсмажування поки немає",

        description:
          "Нові заявки на індивідуальне обсмажування із сайту з’являться тут.",
      },
    },
  },
} as const;
