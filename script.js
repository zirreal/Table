(function () {
  const $form = document.querySelector('.form');
  const $table = document.querySelector('.table');
  const $tbody = document.querySelector('.table-wrapper');
  const $formInputs = document.querySelectorAll('.form-input');
  const $button = document.querySelector('.form__btn');


  const nameInput = document.querySelector('#inputName');
  const lastNameInput = document.querySelector('#inputLastName');
  const middleNameInput = document.querySelector('#inputMiddleName');
  const dateOfBirthInput = document.querySelector('#inputBirthday');
  const beginStudyInput = document.querySelector('#beginStudy');
  const facultyInput = document.querySelector('#faculty');

  let students = [{
      name: 'Алена',
      lastName: 'Армедова',
      middleName: 'Игоревна',
      dateOfBirth: '1999-10-08',
      beginStudy: '2017',
      faculty: 'Иностранных языков',
    },
    {
      name: 'Антон',
      lastName: 'Гоникер',
      middleName: 'Дмитриевич',
      dateOfBirth: '1998-07-24',
      beginStudy: '2016',
      faculty: 'Биологический',
    },
    {
      name: 'Оксана',
      lastName: 'Лугина',
      middleName: 'Александровна',
      dateOfBirth: '1997-04-13',
      beginStudy: '2019',
      faculty: 'Теплоэнергетики',
    },
    {
      name: 'Максим',
      lastName: 'Ковалев',
      middleName: 'Станиславович',
      dateOfBirth: '1998-08-18',
      beginStudy: '2020',
      faculty: 'Строительный',
    },
  ];


  const createTableItem = (name, lastName, middleName, faculty, dateOfBirth, beginStudy, ) => {
    const date = new Date();
    const currDate = date.getFullYear();
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timezone: 'UTC'
    };

    let studyYear = currDate - parseInt(beginStudy);

    if (studyYear <= 4) {
      studyYear = `${studyYear} курс`;
    } else {
      studyYear = 'Закончил';
    }

    let tableBody =
      `<tr>
        <th>#</th>
        <td>${lastName} ${name} ${middleName}</td>
        <td>${faculty}</td>
        <td>${new Date(dateOfBirth).toLocaleString("ru", options)} (${currDate - parseInt(dateOfBirth)} года)</td>
        <td>${parseInt(beginStudy)} - ${parseInt(beginStudy) + 4} (${studyYear})</td>
      </tr>`;


    $tbody.innerHTML += tableBody;
  }


  if (localStorage.getItem('students')) {
    students = JSON.parse(localStorage.getItem('students'));
    for (item of students) {
      let tableItem = createTableItem(item.name, item.lastName, item.middleName, item.faculty, item.dateOfBirth, item.beginStudy);
    }
  };

  const addStudent = () => {

    let student = {
      name: nameInput.value,
      lastName: lastNameInput.value,
      middleName: middleNameInput.value,
      dateOfBirth: dateOfBirthInput.value,
      beginStudy: beginStudyInput.value,
      faculty: facultyInput.value,
    }


    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));

    createTableItem(student.name, student.lastName, student.middleName, student.faculty, student.dateOfBirth, student.beginStudy);

    return student

  };

  const validateYear = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    dateOfBirthInput.setAttribute("max", today);
    beginStudyInput.setAttribute("max", yyyy);

    $button.classList.remove('disabled');
  }

  const validateForm = () => {
    validateYear();

    $formInputs.forEach(item => {
      item.value = item.value.trim();
      item.addEventListener('input', () => {
        if (!item.value) {
          $button.classList.add('disabled');
        } else {
          $button.classList.remove('disabled');
        }
      })
    })
  };


  $form.addEventListener('submit', (el) => {
    validateForm();
    el.preventDefault();
    if (!$form.checkValidity()) {
      $button.classList.add('disabled');
      $form.classList.add('was-validated');
    } else {
      addStudent();
      $formInputs.forEach((e) => {
        e.value = '';
      })
      $button.classList.remove('disabled');
      $form.classList.remove('was-validated');
    }
  }, false)


  let sortedStudents = [...students];

  const arraySortNames = () => {
    sortedStudents.sort((a, b) => {
      let aName = `${a.lastName} ${a.name}  ${a.middleName}`.toUpperCase();
      let bName = `${b.lastName} ${b.name}  ${b.middleName}`.toUpperCase();

      if (aName < bName) {
        return -1;
      }
      if (aName > bName) {
        return 1;
      }

      return 0;
    });
    return sortedStudents;
  }

  const arraySortFaculty = () => {
    sortedStudents.sort((a, b) => {
      let aFaculty = `${a.faculty}`.toUpperCase();
      let bFaculty = `${b.faculty}`.toUpperCase();

      if (aFaculty < bFaculty) {
        return -1;
      }
      if (aFaculty > bFaculty) {
        return 1;
      }

      return 0;
    });
    return sortedStudents;
  }

  const arraySortDate = () => {
    sortedStudents.sort((a, b) => {

      let aDate = new Date(a.dateOfBirth);
      let bDate = new Date(b.dateOfBirth);

      return aDate - bDate
    });
    return sortedStudents;
  };


  const arraySortYears = () => {
    sortedStudents.sort((a, b) => {

      let aYear = new Date(a.beginStudy);
      let bYear = new Date(b.beginStudy);

      return aYear - bYear
    });
    return sortedStudents;
  }

  const addSortedItems = (item) => {

    let reversedArray = sortedStudents.slice().reverse();

    if (item.classList.contains('desc')) {
      item.classList.remove('desc');
      item.classList.add('asc');
      sortedStudents = reversedArray;
      while ($tbody.firstChild) {
        $tbody.removeChild($tbody.firstChild);
      }
    } else if (item.classList.contains('asc')) {
      item.classList.remove('asc');
      item.classList.add('desc');
      while ($tbody.firstChild) {
        $tbody.removeChild($tbody.firstChild);
      }
    }

    for (let i of sortedStudents) {
      createTableItem(i.name, i.lastName, i.middleName, i.faculty, i.dateOfBirth, i.beginStudy);
    }

  }


  const createSortedTable = () => {

    const $tableHeader = document.querySelectorAll('.table-header');
    const $tableNames = document.querySelector('.table-names');
    const $tableFaculties = document.querySelector('.table-faculties');
    const $tableDates = document.querySelector('.table-date');
    const $tableYears = document.querySelector('.table-years');

    $tableHeader.forEach(i => {
      i.classList.add('asc')
    })

    $tableNames.addEventListener('click', () => {
      arraySortNames();
      addSortedItems($tableNames);
    })

    $tableFaculties.addEventListener('click', () => {
      arraySortFaculty();
      addSortedItems($tableFaculties);
    })

    $tableYears.addEventListener('click', () => {
      arraySortYears();
      addSortedItems($tableYears);
    })

    $tableDates.addEventListener('click', () => {
      arraySortDate();
      addSortedItems($tableDates);
    })

  }

  const filterText = (input) => {
    let filter = input.value.toLowerCase();
    let tr = $table.getElementsByTagName("tr");
    for (let i = 1; i < tr.length; i++) {
      tr[i].style.display = "none";
      let td = tr[i].getElementsByTagName("td");
      for (let j = 0; j < td.length; j++) {
        let cell = tr[i].getElementsByTagName("td")[j];
        if (cell) {
          if (cell.innerText.toLowerCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
            break;
          }
        }
      }
    }
  }

  const filterTable = () => {

    const $tableFilters = document.querySelectorAll('.filter-input');

    $tableFilters.forEach(item => {
      item.addEventListener('input', () => {
        filterText(item);
      })
    })

  }


  const reset = () => {
    createSortedTable();
    filterTable();
  }

  window.addEventListener('load', reset())

})();
