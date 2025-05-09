const express = require("express");
const Hobbits = require("./hobbits/hobbits-model.js");

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

server.get("/hobbits", async (req, res) => {
  try {
    const hobbits = await Hobbits.getAll();
    res.status(200).json(hobbits);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve hobbits" });
  }
});

server.get("/hobbits/:id", async (req, res) => {
  try {
    const hobbit = await Hobbits.getById(req.params.id);
    hobbit ? res.status(200).json(hobbit) : res.status(404).json({ message: "Hobbit not found" });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve hobbit" });
  }
});

server.post("/hobbits", async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const newHobbit = await Hobbits.insert(req.body);
    res.status(201).json(newHobbit);
  } catch (error) {
    res.status(500).json({ message: "Failed to add hobbit" });
  }
});

server.put("/hobbits/:id", async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const updatedHobbit = await Hobbits.update(req.params.id, req.body);
    updatedHobbit ? res.status(200).json(updatedHobbit) : res.status(404).json({ message: "Hobbit not found" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update hobbit" });
  }
});

server.delete("/hobbits/:id", async (req, res) => {
  try {
    const deleted = await Hobbits.remove(req.params.id);
    deleted !== undefined
      ? res.status(200).json({ message: "Hobbit deleted" })
      : res.status(404).json({ message: "Hobbit not found" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete hobbit" });
  }
});

module.exports = server;
