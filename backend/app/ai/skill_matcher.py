def calculate_skill_match(user_skills, job_skills):

    # Normalize skills for comparison
    user_normalized = {
        skill.strip().lower(): skill.strip()
        for skill in user_skills
    }

    job_normalized = {
        skill.strip().lower(): skill.strip()
        for skill in job_skills
    }

    # Find matched and missing skills
    matched_normalized = set(user_normalized).intersection(
        set(job_normalized)
    )

    missing_normalized = set(job_normalized) - set(user_normalized)

    # Preserve job's original spelling in the output
    matched_skills = [
        job_normalized[skill]
        for skill in matched_normalized
    ]

    missing_skills = [
        job_normalized[skill]
        for skill in missing_normalized
    ]

    # Calculate percentage
    if len(job_normalized) == 0:
        match_percentage = 0
    else:
        match_percentage = round(
            (len(matched_skills) / len(job_normalized)) * 100,
            2
        )

    return {
        "match_percentage": match_percentage,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }