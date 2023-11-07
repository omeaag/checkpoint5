import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [carName, setCarName] = useState("");

  const [personName, setPersonName] = useState("");
  const [carIdToDelete, setCarIdToDelete] = useState("");
  const [personId, setPersonId] = useState("");
  const [carId, setCarId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [cars, setCars] = useState([]);
  const [persons, setPersons] = useState([]);
  const [carsOwners, setCarsOwners] = useState([]);

  const getAllCars = () => {
    const response = axios.get("http://localhost:3000/get-all-car");
    setCars(response.data);
  };

  const getCarOwners = () => {
    const response = axios.get("http://localhost:3000/carsOwners");
    setCarsOwners(response.data);
  };

  const createCar = () => {
    const response = axios.post("http://localhost:3000/create-car", {
      car_name: carName,
    });
    setCars(...cars, response.data);
  };

  const deleteCar = async (id) => {
    await axios.delete(`http://localhost:3000/delete-car/${id}`);
    setCars(cars.filter((car) => car.id !== id));
  };

  const sellCar = () => {
    axios
      .put(`http://localhost:3000/car/${carId}/sell/${ownerId}`)
      .then((response) => {
        console.log("car sold", response.data);
      })
      .catch((error) => {
        console.error("Error selling car", error);
      });
  };

  const createPerson = () => {
    const response = axios.post("http://localhost:3000/create-person", {
      fullname: personName,
    });
    setPersons(...persons, response.data);
  };

  const deletePerson = (id) => {
    axios.delete(`http://localhost:3000/persons/${id}`);
    setPersons(persons.filter((person) => person.id !== id));
  };

  useEffect(() => {
    getAllCars();
    getCarOwners();
  }, []);

  return (
    <div>
      <ul>
        {carsOwners.map((carOwner) => (
          <li key={carOwner.id}>
            {carOwner.car_name} {carOwner.owner_name}
          </li>
        ))}
      </ul>

      <div>
        <h2>Car List</h2>
        <ul>
          {cars.map((car) => (
            <li key={car.id}>
              car id: {car.id}, car: {car.car_name}, owner id: {car.owner_id}
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h2>Person List</h2>
        <ul>
          {persons.map((person) => (
            <li key={person.id}>
              person id: {person.id}, person name: {person.fullname}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <input
          type="text"
          placeholder="car name"
          value={carName}
          onChange={(e) => setCarName(e.target.value)}
        />
        <button onClick={createCar}>Create Car</button>

        <input
          type="text"
          placeholder="car id to delete"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
        />
        <button onClick={deleteCar}>Delete Car</button>

        <input
          type="text"
          placeholder="Car ID to sell"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Owner ID"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
        />
        <button onClick={sellCar}>Sell Car</button>
      </div>

      <div className="section">
        <input
          type="text"
          placeholder="Person Name"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
        />
        <button onClick={createPerson}>Create Person</button>

        <input
          type="text"
          placeholder="Person ID to delete"
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
        />
        <button onClick={deletePerson}>Delete Person</button>
      </div>
    </div>
  );
}

export default App;
