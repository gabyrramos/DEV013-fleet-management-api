import request  from "supertest";
import app from "../app";
 // Importa tu aplicación Express

describe('GET /taxis', () => {
  it('should return all taxis', async () => {
    const response = await request(app).get('/taxis');
    expect(response.status).toBe(200);
   
  });
  it('should return not found when the limit is less than 10', async () => {
    const response = await request(app).get("/taxis?page=1&limit=9").send();
    expect(response.statusCode).toBe(400);
  })

  it('should return not found for a non-existing page', async () => {
    const response = await request(app).get('/taxis?page=1000&limit=10');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No se encontraron usuarios");
  });
  
  it('should return taxis in JSON format', async () => {
    const response = await request(app).get('/taxis?page=1&limit=10');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
  });
});