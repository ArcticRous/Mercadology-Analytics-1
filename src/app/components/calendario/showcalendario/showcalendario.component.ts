import { Component, OnInit, ViewChild, forwardRef, AfterViewInit } from '@angular/core';
import { CalendarOptions, Calendar } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarioModel } from '../../../models/calendario.model';

@Component({
  selector: 'app-calendario',
  templateUrl: './showcalendario.component.html',
  styleUrls: ['./showcalendario.component.css']
})
export class ShowcalendarioComponent implements OnInit {
  CalendarioTemp: Object = {
    'title': "",
    'start': ""
  };

  calendarVisible = true;
  calendarOptions: CalendarOptions;
  eventsModel: any;
  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
  calendario: CalendarioModel[] = [];
  calendarios: CalendarioModel;
  addEventForm: FormGroup;

  eventdate: string;

  get f() { return this.addEventForm.controls; }

  constructor(public AuthS: AuthService, private formBuilder: FormBuilder) { }

  onSubmit() {
    this.calendarios = new CalendarioModel();
  }

  ngOnInit(): void {

    // need for load calendar bundle first
    this.calendarios = new CalendarioModel();
    forwardRef(() => Calendar);
    this.AuthS.getCalendario().subscribe(next => {
      this.calendario = next;
      console.log(this.calendario);
    }, error => {
      console.log(error);
    }, () => {
      this.calendarOptions = {
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        initialView: 'dayGridMonth',
        // initialEvents: this.hola, // alternatively, use the `events` setting to fetch from a feed
        weekends: true,
        editable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        events: this.calendario,
        locale: esLocale,
        height: 700

      };
    })

    this.addEventForm = this.formBuilder.group({
      title: ['', [Validators.required]]
    });

  }


}
