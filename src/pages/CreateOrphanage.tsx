import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';

import { FiPlus } from "react-icons/fi";

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import { LeafletMouseEvent } from "leaflet";
import api from "../services/api";
import { useHistory } from "react-router-dom";

export default function CreateOrphanage() {
  const history = useHistory();
  const [position, setPosition] = useState({ latitude:0 , longitude: 0})
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const [form, setForm] = useState({
    name: '',
    about: '',
    instructions: '',
    openig_hours: '',
    open_on_weekends: true
  });

  function handleMapClick (event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  function setValue (chave: any, valor: any) {
    // chave: nome, descricao, bla, bli
    setForm({
      ...form,
      [chave]: valor // nome: 'valor'
    })
  }

  function updateForm (e: any) {
    setValue(
      e.target.getAttribute('id'),
      e.target.value
    )
  }

  function handleSelectImages (event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }
    const selectedImages = Array.from(event.target.files);

    setImages(selectedImages)

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image)
    });

    setPreviewImages(selectedImagesPreview);
  }

  async function handleSubmit (event: FormEvent) {
    event.preventDefault();

    const data = new FormData();

    data.append('name', form.name)
    data.append('about', form.about)
    data.append('instructions', form.instructions)
    data.append('openig_hours', form.openig_hours)
    data.append('open_on_weekends', String(form.open_on_weekends))
    data.append('latitude', String(position.latitude))
    data.append('longitude', String(position.longitude))

    images.forEach(image => {
      data.append('images', image)
    })

    await api.post('orphanages', data)

    alert('Cadastro realizado com sicesso');

    history.push('/app')
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-28.4516617,-52.2025863]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer 
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
              />

              {position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude,
                  position.longitude]}
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={form.name}
                onChange={updateForm}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea
                id="about"
                maxLength={300}
                value={form.about}
                onChange={updateForm}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">

                {previewImages.map(image => {
                  return (
                    <img
                      key={image}
                      src={image}
                      alt={form.name}
                    />
                  )
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input type="file" onChange={handleSelectImages} multiple id="image[]" />

            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={form.instructions}
                onChange={updateForm}
              />
            </div>

            <div className="input-block">
              <label htmlFor="openig_hours">Horário de funcionamento</label>
              <input
                id="openig_hours"
                value={form.openig_hours}
                onChange={updateForm}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={form.open_on_weekends ? 'active' : ''}
                  onClick={() => {
                    setForm(prevState => {
                      return { ...prevState, open_on_weekends: true }
                    });
                  }}
                >
                    Sim
                </button>
                <button
                  type="button"
                  className={!form.open_on_weekends ? 'active' : ''}
                  onClick={() => {
                    setForm(prevState => {
                      return { ...prevState, open_on_weekends: false }
                    });
                  }}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;let
