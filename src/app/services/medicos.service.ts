import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Medico, MedicoRequest } from '../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {
  private medicosDataUrl = '/assets/data/medicos.json';
  private medicosSubject = new BehaviorSubject<Medico[]>([]);
  public medicos$ = this.medicosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadMedicos();
  }

  private loadMedicos(): void {
    this.http.get<{ medicos: Medico[] }>(this.medicosDataUrl).subscribe(response => {
      const medicos = response.medicos.map(m => ({
        ...m,
        fechaRegistro: new Date(m.fechaRegistro)
      }));
      this.medicosSubject.next(medicos);
    });
  }

  getMedicos(): Observable<Medico[]> {
    return this.medicos$;
  }

  getMedicosActivos(): Observable<Medico[]> {
    return this.medicos$.pipe(
      map(medicos => medicos.filter(m => m.estado === 'activo'))
    );
  }

  getMedicoById(id: number): Observable<Medico | undefined> {
    return this.medicos$.pipe(
      map(medicos => medicos.find(m => m.id === id))
    );
  }

  addMedico(medico: MedicoRequest): Observable<Medico> {
    const medicos = this.medicosSubject.value;
    const newId = Math.max(...medicos.map(m => m.id), 0) + 1;
    const newMedico: Medico = {
      id: newId,
      ...medico,
      fechaRegistro: new Date()
    };

    this.medicosSubject.next([...medicos, newMedico]);

    return new Observable(observer => {
      observer.next(newMedico);
      observer.complete();
    });
  }

  updateMedico(id: number, medico: Partial<MedicoRequest>): Observable<Medico> {
    const medicos = this.medicosSubject.value;
    const index = medicos.findIndex(m => m.id === id);

    if (index !== -1) {
      const updated = [...medicos];
      updated[index] = { ...updated[index], ...medico };
      this.medicosSubject.next(updated);

      return new Observable(observer => {
        observer.next(updated[index]);
        observer.complete();
      });
    }

    throw new Error('Médico no encontrado');
  }

  deleteMedico(id: number): Observable<boolean> {
    const medicos = this.medicosSubject.value;
    const updated = medicos.filter(m => m.id !== id);
    this.medicosSubject.next(updated);

    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  searchMedicos(term: string): Observable<Medico[]> {
    return this.medicos$.pipe(
      map(medicos => medicos.filter(m =>
        m.nombre.toLowerCase().includes(term.toLowerCase()) ||
        m.apellidos.toLowerCase().includes(term.toLowerCase()) ||
        m.especialidad.toLowerCase().includes(term.toLowerCase()) ||
        m.numeroLicencia.toLowerCase().includes(term.toLowerCase())
      ))
    );
  }
}
