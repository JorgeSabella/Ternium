const request = require('supertest');
const {Staff} = require('../../models/staff');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/staffs', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => { 
      await server.close(); 
      await Staff.remove({});
    });
    describe('GET /', () => {
        it('should return all staffs', async () => {
          const staffs = [
            { 
                name: 'staff1',
                area: 'area1',
                registrationId: '1',
                supervisor: {
                    name: 'supervisor1',
                    username: 'username1'
                }
            },
            { 
                name: 'staff2',
                area: 'area2',
                registrationId: '2',
                supervisor: {
                    name: 'supervisor2',
                    username: 'username2'
                }
            },
          ];
          
          await Staff.collection.insertMany(staffs);
    
          const res = await request(server).get('/api/staffs');
          
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(2);
          expect(res.body.some(g => g.name === 'staff1')).toBeTruthy();
          expect(res.body.some(g => g.name === 'staff2')).toBeTruthy();
          expect(res.body.some(g => g.area === 'area1')).toBeTruthy();
          expect(res.body.some(g => g.area === 'area2')).toBeTruthy();
          expect(res.body.some(g => g.registrationId === '1')).toBeTruthy();
          expect(res.body.some(g => g.registrationId === '2')).toBeTruthy();
          expect(res.body.some(g => g.supervisor.name === 'supervisor1')).toBeTruthy();
          expect(res.body.some(g => g.supervisor.name === 'supervisor2')).toBeTruthy();
          expect(res.body.some(g => g.supervisor.username === 'username1')).toBeTruthy();
          expect(res.body.some(g => g.supervisor.username === 'username2')).toBeTruthy();
        });
      });
    describe('GET /:id', () => {
        it('should return a staff if valid registrationId is passed', async () => {
          let staff = new Staff({ 
                name: 'staff1',
                area: 'area1',
                registrationId: '12',
                supervisor: {
                    name: 'supervisor1',
                    username: 'username1'
                }
          });
          await staff.save();
    
          const res = await request(server).get('/api/staffs/' + staff.registrationId);
    
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('name', staff.name);     
          expect(res.body).toHaveProperty('area', staff.area);     
          expect(res.body).toHaveProperty('registrationId', staff.registrationId);     
          expect(res.body).toHaveProperty('supervisor.name', staff.supervisor.name);     
          expect(res.body).toHaveProperty('supervisor.username', staff.supervisor.username);     
        });
    
        it('should return 404 if no staff with the given registrationId exists', async () => {
          const id = mongoose.Types.ObjectId();
          const res = await request(server).get('/api/staffs/' + id);
    
          expect(res.status).toBe(404);
        });
      });
    describe('POST /', () => {

        // Define the happy path, and then in each test, we change 
        // one parameter that clearly aligns with the definition of the 
        // test. 
        let token; 
        let staff;
        let user;
    
        const exec = async () => {
          return await request(server)
            .post('/api/staffs')
            .set('x-auth-token', token)
            .send( {
                name: 'staff1',
                area: 'area1',
                registrationId: '12',
                supervisor: {
                    name: 'supervisor1',
                    username: user.username
                }
              } );
        }
    
        beforeEach(() => {
          token = new User().generateAuthToken();      
          user = new User({
              name: 'user1',
              password: '12345678',
              username: 'username1',
              area: 'area1',
              rol: 'rol1'
          });
          staff = {
            name: 'staff1',
            area: 'area1',
            registrationId: '12',
            supervisor: {
                name: 'supervisor1',
                username: user.username
            }
          };
        })
    
        it('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        it('should return 400 if staff is less than 2 characters', async () => {
          staff.name = '1'; 
          
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        it('should return 400 if staff is more than 1024 characters', async () => {
          staff.name = new Array(1026).join('a');
    
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        it('should save the staff if it is valid', async () => {
          await exec();
    
          const staff = await Staff.find({ name: 'staff1' });
    
          expect(staff).not.toBeNull();
        });
    
        it('should return the staff if it is valid', async () => {
            const res = await exec();
            console.log(res.body);
            //expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', staff.name);     
            expect(res.body).toHaveProperty('area', staff.area);     
            expect(res.body).toHaveProperty('registrationId', staff.registrationId);     
            expect(res.body).toHaveProperty('supervisor.name', staff.supervisor.name);     
            expect(res.body).toHaveProperty('supervisor.username', staff.supervisor.username); 
        });
      });
});