const db = require('../../data/dbConfig.js');
const Hobbit = require('./hobbits-model.js');

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
});

beforeEach(async () => {
    await db.seed.run();
});

test('environment is testing', () => {
    expect(process.env.NODE_ENV).toBe('testing');
});

describe('getAll', () => {
    test('resolves all the hobbits in the table', async () => {
        const result = await Hobbit.getAll();
        expect(result).toHaveLength(4);
        expect(result[0]).toMatchObject({ name: 'sam' });
        expect(result[1]).toMatchObject({ name: 'frodo' });
        expect(result[2]).toMatchObject({ name: 'pippin' });
        expect(result[3]).toMatchObject({ name: 'merry' });
    });
});

describe('getById', () => {
    test('resolves the hobbit by the given id', async () => {
        let result = await Hobbit.getById(1);
        expect(result).toMatchObject({ name: 'sam' });
        result = await Hobbit.getById(2);
        expect(result).toMatchObject({ name: 'frodo' });
        result = await Hobbit.getById(3);
        expect(result).toMatchObject({ name: 'pippin' });
        result = await Hobbit.getById(4);
        expect(result).toMatchObject({ name: 'merry' });
    });

    test('returns undefined if hobbit does not exist', async () => {
        const result = await Hobbit.getById(999);
        expect(result).toBeUndefined();
    });
});

describe('insert', () => {
    const bilbo = { name: 'bilbo' };

    test('resolves the newly created hobbits', async () => {
        const result = await Hobbit.insert(bilbo);
        expect(result).toMatchObject(bilbo);
    });

    test('adds the hobbit to the hobbits table', async () => {
        await Hobbit.insert(bilbo);
        const records = await db('hobbits');
        expect(records).toHaveLength(5);
    });
});

describe('update', () => {
    test('updates an existing hobbit', async () => {
        const changes = { name: 'Updated Hobbit' };
        const result = await Hobbit.update(1, changes);
        expect(result).toMatchObject(changes);

        const updatedHobbit = await Hobbit.getById(1);
        expect(updatedHobbit.name).toBe('Updated Hobbit');
    });

    test('returns undefined when updating a nonexistent hobbit', async () => {
        const changes = { name: 'Ghost Hobbit' };
        const result = await Hobbit.update(999, changes);
        expect(result).toBeUndefined();
    });
});

describe('remove', () => {
    test('deletes a hobbit successfully', async () => {
        await Hobbit.remove(1);
        const result = await Hobbit.getById(1);
        expect(result).toBeUndefined();

        const records = await db('hobbits');
        expect(records).toHaveLength(3);
    });

    test('returns undefined when deleting a nonexistent hobbit', async () => {
        const result = await Hobbit.remove(999);
        expect(result).toBeUndefined();
    });
});
